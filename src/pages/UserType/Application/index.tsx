import { useIntl } from '@umijs/max';
import { queryList, removeItem, updateItem } from '@/services/ant-design-pro/api';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { FooterToolbar, PageContainer, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, useAccess } from '@umijs/max';
import { message } from 'antd';
import React, { useRef, useState } from 'react';
import Show from './components/Show';
import DeleteButton from '@/components/DeleteButton';
import DeleteLink from '@/components/DeleteLink';
import GenerateBoundProxyModal from '../../BotUser/components/GenerateBoundProxyModal';
import RejectApplicationModal from './components/RejectApplicationModal';

const handleRemove = async (ids: string[]) => {
  const hide = message.loading(<FormattedMessage id="deleting" defaultMessage="Deleting..." />);
  if (!ids) return true;
  try {
    await removeItem('/applications', {
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
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.ItemData>();
  const [selectedRowsState, setSelectedRows] = useState<API.ItemData[]>([]);
  const [generateProxyModalOpen, setGenerateProxyModalOpen] = useState(false);
  const [activeKey, setActiveKey] = useState<string | undefined>('');
  const [generateProxyLoading, setGenerateProxyLoading] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const access = useAccess();

  // 生成绑定代理处理函数
  const handleGenerateProxy = async (values: any) => {
    setGenerateProxyLoading(true);
    try {
      await updateItem(`/bot-users/${currentRow?.botUser._id}/generate-bound-proxy`, {
        ...values,
      });
      message.success('生成绑定代理成功');
      setGenerateProxyModalOpen(false);
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } catch (error: any) {
      message.error(error?.response?.data?.message || '生成绑定代理失败');
    } finally {
      setGenerateProxyLoading(false);
    }
  };

  const columns: ProColumns<API.ItemData>[] = [
    {
      title: intl.formatMessage({ id: 'user' }),
      dataIndex: 'botUser',
      copyable: true,
      renderText: (botUser) => botUser?.userName || botUser?.displayName,
    },
    {
      title: intl.formatMessage({ id: 'bot', defaultMessage: '机器人' }),
      dataIndex: 'bot',
      copyable: true,
      renderText: (bot) => bot?.botName,
    },
    {
      title: intl.formatMessage({ id: 'status', defaultMessage: '状态' }),
      dataIndex: 'status',
      hideInSearch: true,
      valueEnum: {
        pending: { text: intl.formatMessage({ id: 'pending' }), status: 'warning' },
        approved: { text: intl.formatMessage({ id: 'approved' }), status: 'success' },
        rejected: { text: intl.formatMessage({ id: 'rejected' }), status: 'error' },
      },
    },
    // remark
    {
      title: intl.formatMessage({ id: 'remark', defaultMessage: '备注' }),
      dataIndex: 'remark',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'createdAt', defaultMessage: '创建时间' }),
      dataIndex: 'createdAt',
      hideInSearch: true,
      valueType: 'dateTime',
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
        access.canDeleteApplication && (
          <DeleteLink
            key="delete"
            onOk={async () => {
              await handleRemove([record._id!]);
              actionRef.current?.reload();
            }}
          />
        ),
        access.canUpdateApplication && record.status === 'pending' && (
          <a
            key="approve"
            onClick={() => {
              setCurrentRow(record);
              setGenerateProxyModalOpen(true);
            }}
          >
            <FormattedMessage id="approve" defaultMessage="批准" />
          </a>
        ),
        access.canUpdateApplication && record.status === 'pending' && (
          <a
            key="rejected"
            onClick={() => {
              setCurrentRow(record);
              setRejectModalOpen(true);
            }}
          >
            <FormattedMessage id="rejected" defaultMessage="拒绝" />
          </a>
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
          collapsed: false,
        }}
        toolbar={{
          menu: {
            type: 'tab',
            activeKey: activeKey,
            items: [
              {
                label: <FormattedMessage id="all" defaultMessage="all" />,
                key: '',
              },
              {
                label: <FormattedMessage id="pending" defaultMessage="pending" />,
                key: 'pending',
              },
              {
                label: <FormattedMessage id="approved" defaultMessage="approved" />,
                key: 'approved',
              },
              {
                label: <FormattedMessage id="rejected" defaultMessage="rejected" />,
                key: 'rejected',
              },
            ],
            onChange: (key: any) => {
              setActiveKey(key);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            },
          },
        }}
        request={(params, sort, filter) =>
          queryList('/applications', { ...params, status: activeKey }, sort, filter)
        }
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
          {access.canDeleteApplication && (
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

      <Show
        open={showDetail}
        currentRow={currentRow || ({} as API.ItemData)}
        columns={columns as ProDescriptionsItemProps<API.ItemData>[]}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
      />

      <GenerateBoundProxyModal
        open={generateProxyModalOpen}
        onOpenChange={setGenerateProxyModalOpen}
        onFinish={handleGenerateProxy}
        loading={generateProxyLoading}
      />

      <RejectApplicationModal
        open={rejectModalOpen}
        onCancel={setRejectModalOpen}
        currentRow={currentRow}
        onFinish={() => {
          setRejectModalOpen(false);
          actionRef.current?.reload();
        }}
      />
    </PageContainer>
  );
};

export default TableList;
