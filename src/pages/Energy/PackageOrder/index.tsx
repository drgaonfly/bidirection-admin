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
import PackageOrderStatusEnum from '@/enums/packageOrderStatus';
import PaymentTypeEnum from '@/enums/paymentType';
import Update from './components/Update';

const handleRemove = async (ids: string[]) => {
  const hide = message.loading(<FormattedMessage id="deleting" defaultMessage="Deleting..." />);
  if (!ids) return true;
  try {
    await removeItem('/package-orders', {
      ids,
    });
    hide();
    message.success(<FormattedMessage id="delete_successful" defaultMessage="Delete successful" />);
    return true;
  } catch (error: any) {
    hide();
    message.error(
      error.response?.data?.message ?? (
        <FormattedMessage id="delete_failed" defaultMessage="Delete failed, please try again" />
      ),
    );
    return false;
  }
};

const handleUpdate = async (fields: any) => {
  const hide = message.loading(<FormattedMessage id="updating" defaultMessage="Updating..." />);
  try {
    await updateItem(`/package-orders/${fields._id}`, fields);
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

const TableList: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<string | undefined>('');
  const [currentRow, setCurrentRow] = useState<API.ItemData>();
  const [selectedRowsState, setSelectedRows] = useState<API.ItemData[]>([]);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  const access = useAccess();

  const columns: ProColumns<API.ItemData>[] = [
    {
      title: intl.formatMessage({ id: 'packageOrder.columns.orderId' }),
      dataIndex: 'id',
      copyable: true,
      ellipsis: true,
      width: 120,
    },
    {
      title: intl.formatMessage({ id: 'packageOrder.columns.bot' }),
      dataIndex: ['bot', 'botName'],
      hideInSearch: true,
      width: 120,
    },
    {
      title: intl.formatMessage({ id: 'packageOrder.columns.user' }),
      dataIndex: ['botUser', 'userName'],
      hideInSearch: true,
      width: 120,
    },
    {
      title: intl.formatMessage({ id: 'packageOrder.columns.times' }),
      dataIndex: 'times',
      valueType: 'digit',
      width: 80,
    },
    // current_times
    {
      title: intl.formatMessage({ id: 'packageOrder.columns.currentTimes' }),
      dataIndex: 'current_times',
      valueType: 'digit',
      width: 80,
    },
    {
      title: intl.formatMessage({ id: 'packageOrder.columns.price' }),
      dataIndex: 'price',
      width: 100,
    },
    {
      title: intl.formatMessage({ id: 'packageOrder.columns.energy' }),
      dataIndex: 'energy',
      valueType: 'digit',
      width: 100,
    },
    {
      title: intl.formatMessage({ id: 'packageOrder.columns.validityDays' }),
      dataIndex: 'validityDays',
      valueType: 'digit',
      width: 100,
    },
    {
      title: intl.formatMessage({ id: 'packageOrder.columns.minConsumption' }),
      dataIndex: 'minConsumption',
      width: 100,
    },
    {
      title: intl.formatMessage({ id: 'packageOrder.columns.paymentType' }),
      dataIndex: 'paymentType',
      valueEnum: PaymentTypeEnum,
      width: 100,
    },
    {
      title: intl.formatMessage({ id: 'packageOrder.columns.expiredAt' }),
      dataIndex: 'expiredAt',
      valueType: 'dateTime',
      width: 150,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'packageOrder.columns.status' }),
      dataIndex: 'status',
      valueEnum: PackageOrderStatusEnum,
      width: 100,
    },
    {
      title: intl.formatMessage({ id: 'packageOrder.columns.proxy' }),
      dataIndex: 'proxy',
      hideInSearch: true,
      width: 100,
      renderText: (_, record) => {
        return record.proxy?.name;
      },
    },
    {
      title: intl.formatMessage({ id: 'packageOrder.columns.createdAt' }),
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      width: 150,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'expiredAt' }),
      dataIndex: 'expiredAt',
      valueType: 'dateTime',
      width: 150,
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" />,
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 200,
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
        access.canDeletePackageOrder && (
          <DeleteLink
            key="delete"
            onOk={async () => {
              await handleRemove([record._id!]);
              actionRef.current?.reload();
            }}
          />
        ),
        access.canUpdateBot && (
          <a
            key="edit"
            onClick={() => {
              console.log();

              handleUpdateModalOpen(true);
              setCurrentRow(record);
            }}
          >
            {intl.formatMessage({ id: 'edit' })}
          </a>
        ),
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.ItemData, API.PageParams>
        headerTitle={intl.formatMessage({ id: 'packageOrder.headerTitle' })}
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
                label: intl.formatMessage({ id: 'all' }),
                key: '',
              },
              {
                label: intl.formatMessage({ id: 'using' }),
                key: 'using',
              },
              {
                label: intl.formatMessage({ id: 'expired' }),
                key: 'expired',
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
        toolBarRender={() => []}
        request={(params, sort, filter) =>
          queryList('/package-orders', { ...params, status: activeKey }, sort, filter)
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
          {access.canDeletePackageOrder && (
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

      {access.canUpdatePackageOrder && (
        <Update
          onSubmit={async (value) => {
            const success = await handleUpdate(value);
            if (success) {
              handleUpdateModalOpen(false);
              setCurrentRow(undefined);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={handleUpdateModalOpen}
          updateModalOpen={updateModalOpen}
          values={currentRow}
        />
      )}
    </PageContainer>
  );
};

export default TableList;
