import { useIntl } from '@umijs/max';
import { addItem, queryList, removeItem, updateItem } from '@/services/ant-design-pro/api';
// import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { FooterToolbar, PageContainer, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, useAccess } from '@umijs/max';
import { message } from 'antd';
import React, { useRef, useState } from 'react';
import type { FormValueType } from './components/Update';
import Update from './components/Update';
import Create from './components/Create';
import Show from './components/Show';
import DeleteButton from '@/components/DeleteButton';
import DeleteLink from '@/components/DeleteLink';
import ReactQuill from 'react-quill';
import useQueryList from '@/hooks/useQueryList';

const handleAdd = async (fields: API.ItemData) => {
  const hide = message.loading(<FormattedMessage id="adding" defaultMessage="Adding..." />);

  try {
    await addItem('/chats', { ...fields });
    hide();
    message.success(<FormattedMessage id="add_successful" defaultMessage="Added successfully" />);
    return true;
  } catch (error: any) {
    hide();
    message.error(
      error?.response?.data?.message ?? (
        <FormattedMessage id="upload_failed" defaultMessage="Upload failed, please try again!" />
      ),
    );
    return false;
  }
};

const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading(<FormattedMessage id="updating" defaultMessage="Updating..." />);
  try {
    await updateItem(`/chats/${fields._id}`, fields);
    hide();
    message.success(<FormattedMessage id="update_successful" defaultMessage="Update successful" />);
    return true;
  } catch (error: any) {
    hide();
    message.error(
      error?.response?.data?.message ?? (
        <FormattedMessage id="update_failed" defaultMessage="Update failed, please try again!" />
      ),
    );
    return false;
  }
};

const handleRemove = async (ids: string[]) => {
  const hide = message.loading(<FormattedMessage id="deleting" defaultMessage="Deleting..." />);
  if (!ids) return true;
  try {
    await removeItem('/chats', {
      ids,
    });
    hide();
    message.success(<FormattedMessage id="delete_successful" defaultMessage="Delete successful" />);
    return true;
  } catch (error: any) {
    hide();
    message.error(
      error.response.data.message ?? (
        <FormattedMessage id="delete_failed" defaultMessage="Delete failed, please try again" />
      ),
    );
    return false;
  }
};

const TableList: React.FC = () => {
  const intl = useIntl();
  const { items: users } = useQueryList('/users');
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.ItemData>();
  const [selectedRowsState, setSelectedRows] = useState<API.ItemData[]>([]);
  const access = useAccess();

  const columns: ProColumns<API.ItemData>[] = [
    {
      title: intl.formatMessage({ id: 'chat.user', defaultMessage: '客服人员' }),
      dataIndex: ['user', '_id'],
      hideInTable: true,
      // 添加下拉选择框用于筛选用户
      valueType: 'select',
      fieldProps: {
        options: users?.map((user: any) => ({
          label: user.name,
          value: user._id,
        })),
      },
    },
    {
      // sender
      title: intl.formatMessage({ id: 'chat.sender', defaultMessage: '发送者' }),
      dataIndex: 'sender',
      valueType: 'select',
      fieldProps: {
        options: [
          { label: '客服', value: 'user' },
          { label: '客户', value: 'customer' },
        ],
      },
      render: (_, record) => {
        // 如果是customer,则显示customer.address，如果是user，则显示user.name
        return (
          <div>{record.sender === 'customer' ? record.customer?.address : record.user?.name}</div>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'chat.customer', defaultMessage: '客户' }),
      dataIndex: ['customer', 'address'],
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: intl.formatMessage({ id: 'chat.message', defaultMessage: '消息内容' }),
      dataIndex: 'message',
      hideInSearch: true,
      render: (dom) => {
        return (
          <div>
            <ReactQuill
              value={dom as string} // 使用 ReactQuill 显示内容
              readOnly={true} // 设置为只读模式
              theme="bubble" // 使用轻量的 Bubble 主题
            />
          </div>
        );
      },
    },
    // isSoftDeleted
    {
      title: intl.formatMessage({ id: 'chat.isSoftDeleted', defaultMessage: '是否被删除' }),
      dataIndex: 'isSoftDeleted',
      hideInSearch: true,
      render: (dom) => {
        return (
          <div>
            <span style={{ color: dom ? 'red' : 'green' }}>
              {dom ? (
                <FormattedMessage id="yes" defaultMessage="是" />
              ) : (
                <FormattedMessage id="no" defaultMessage="否" />
              )}
            </span>
          </div>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'chat.isRead', defaultMessage: '是否已读' }),
      dataIndex: 'isRead',
      hideInSearch: true,
      hideInTable: true,
      valueEnum: {
        true: { text: '已读', status: 'Success' },
        false: { text: '未读', status: 'Warning' },
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" />,
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (_, record) => [
        <a
          key="detail"
          onClick={() => {
            setCurrentRow(record);
            setShowDetail(true);
          }}
        >
          <FormattedMessage id="detail" defaultMessage="详情" />
        </a>,
        access.canUpdateChat && (
          <a
            key="edit"
            onClick={() => {
              handleUpdateModalOpen(true);
              setCurrentRow(record);
            }}
          >
            <FormattedMessage id="edit" defaultMessage="编辑" />
          </a>
        ),
        access.canDeleteChat && (
          <DeleteLink
            key="delete"
            onOk={async () => {
              await handleRemove([record._id!]);
              actionRef.current?.reload();
            }}
          />
        ),
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.ItemData, API.PageParams>
        headerTitle={intl.formatMessage({ id: 'list' })}
        actionRef={actionRef}
        rowKey="_id"
        scroll={{ x: 'max-content' }}
        search={{
          labelWidth: 120,
        }}
        // toolBarRender={() => [
        //   access.canCreateChat && (
        //     <Button
        //       type="primary"
        //       key="primary"
        //       onClick={() => {
        //         handleModalOpen(true);
        //       }}
        //     >
        //       <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" />
        //     </Button>
        //   ),
        // ]}
        request={(params, sort, filter) => queryList('/chats', params, sort, filter)}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" />
            </div>
          }
        >
          {access.canDeleteChat && (
            <DeleteButton
              onOk={async () => {
                await handleRemove(selectedRowsState.map((item) => item._id!));
                setSelectedRows([]);
                actionRef.current?.reloadAndRest?.();
              }}
            />
          )}
        </FooterToolbar>
      )}

      {access.canCreateChat && (
        <Create
          open={createModalOpen}
          onOpenChange={handleModalOpen}
          onFinish={async (value) => {
            const success = await handleAdd(value);
            if (success) {
              handleModalOpen(false);
              actionRef.current?.reload();
            }
          }}
        />
      )}

      {access.canUpdateChat && (
        <Update
          onSubmit={async (value) => {
            const success = await handleUpdate(value);
            if (success) {
              handleUpdateModalOpen(false);
              setCurrentRow(undefined);
              actionRef.current?.reload();
            }
          }}
          onCancel={() => {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
          }}
          updateModalOpen={updateModalOpen}
          values={currentRow || {}}
        />
      )}

      <Show
        open={showDetail}
        currentRow={currentRow || ({} as API.ItemData)}
        columns={columns as ProDescriptionsItemProps<API.ItemData>[]}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
      />
    </PageContainer>
  );
};

export default TableList;
