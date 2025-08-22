import { useIntl } from '@umijs/max';
import { queryList, removeItem } from '@/services/ant-design-pro/api';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { FooterToolbar, PageContainer, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, useAccess } from '@umijs/max';
import { message } from 'antd';
import React, { useRef, useState } from 'react';
import Show from './components/Show';
import DeleteButton from '@/components/DeleteButton';
import DeleteLink from '@/components/DeleteLink';
import UsageStatusEnum from '@/enums/usageStatus';
import PackageUsageTypeEnum from '@/enums/packageUsageType';

const handleRemove = async (ids: string[]) => {
  const hide = message.loading(<FormattedMessage id="deleting" defaultMessage="Deleting..." />);
  if (!ids) return true;
  try {
    await removeItem('/package-usage-records', {
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

const TableList: React.FC = () => {
  const intl = useIntl();
  const access = useAccess();
  const actionRef = useRef<ActionType>();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<string | undefined>('');
  const [currentRow, setCurrentRow] = useState<API.ItemData>();
  const [selectedRowsState, setSelectedRows] = useState<API.ItemData[]>([]);

  const columns: ProColumns<API.ItemData>[] = [
    {
      title: intl.formatMessage({ id: 'packageUsageRecord.columns.id' }),
      dataIndex: 'id',
      copyable: true,
      ellipsis: true,
      width: 120,
    },
    {
      title: intl.formatMessage({ id: 'packageUsageRecord.columns.packageOrder' }),
      dataIndex: 'packageOrder',
      copyable: true,
      width: 120,
      renderText: (_, record) => {
        return record.packageOrder?.id;
      },
    },
    {
      title: intl.formatMessage({ id: 'packageUsageRecord.columns.bot' }),
      dataIndex: 'bot',
      hideInSearch: true,
      width: 120,
      renderText: (_, record) => {
        return record.bot?.botName;
      },
    },
    {
      title: intl.formatMessage({ id: 'packageUsageRecord.columns.botUser' }),
      dataIndex: 'botUser',
      hideInSearch: true,
      width: 120,
      renderText: (_, record) => {
        return record.botUser?.userName;
      },
    },
    {
      title: intl.formatMessage({ id: 'packageUsageRecord.columns.proxy' }),
      dataIndex: 'proxy',
      hideInSearch: true,
      width: 100,
      renderText: (_, record) => {
        return record.proxy?.name;
      },
    },
    {
      title: intl.formatMessage({ id: 'packageUsageRecord.columns.address' }),
      dataIndex: 'address',
      copyable: true,
      ellipsis: true,
      width: 150,
    },
    {
      title: intl.formatMessage({ id: 'packageUsageRecord.columns.status' }),
      dataIndex: 'status',
      hideInSearch: true,
      valueEnum: UsageStatusEnum,
      width: 100,
    },
    // recycling_status
    {
      title: intl.formatMessage({ id: 'packageUsageRecord.columns.recycleStatus' }),
      dataIndex: 'recycling_status',
      hideInSearch: true,
      valueEnum: UsageStatusEnum,
      width: 100,
    },
    {
      title: intl.formatMessage({ id: 'packageUsageRecord.columns.usedTimes' }),
      dataIndex: 'usedTimes',
      valueType: 'digit',
      width: 100,
    },
    // type
    {
      title: intl.formatMessage({ id: 'packageUsageRecord.columns.type' }),
      dataIndex: 'type',
      valueEnum: PackageUsageTypeEnum,
    },
    {
      title: intl.formatMessage({ id: 'packageUsageRecord.columns.usedAt' }),
      dataIndex: 'usedAt',
      valueType: 'dateTime',
      width: 150,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'packageUsageRecord.columns.notes' }),
      dataIndex: 'notes',
      ellipsis: true,
      width: 150,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'packageUsageRecord.columns.createdAt' }),
      dataIndex: 'createdAt',
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
        access.canDeletePackageUsageRecord && (
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
        headerTitle={intl.formatMessage({ id: 'packageUsageRecord.headerTitle' })}
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
                label: intl.formatMessage({ id: 'packageUsageRecord.filter.all' }),
                key: '',
              },
              {
                label: intl.formatMessage({ id: 'packageUsageRecord.filter.success' }),
                key: 'success',
              },
              {
                label: intl.formatMessage({ id: 'packageUsageRecord.filter.failed' }),
                key: 'failed',
              },
              {
                label: intl.formatMessage({ id: 'packageUsageRecord.filter.pending' }),
                key: 'pending',
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
          queryList('/package-usage-records', { ...params, status: activeKey }, sort, filter)
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
          {access.canDeletePackageUsageRecord && (
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
    </PageContainer>
  );
};

export default TableList;
