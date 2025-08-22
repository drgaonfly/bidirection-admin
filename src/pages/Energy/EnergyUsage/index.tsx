import { useIntl } from '@umijs/max';
import { queryList, removeItem } from '@/services/ant-design-pro/api';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { FooterToolbar, PageContainer, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, useAccess } from '@umijs/max';
import { Badge, message } from 'antd';
import React, { useRef, useState } from 'react';
import Show from './components/Show';
import DeleteButton from '@/components/DeleteButton';
import DeleteLink from '@/components/DeleteLink';
import PackageUsageTypeEnum from '@/enums/packageUsageType';

const handleRemove = async (ids: string[]) => {
  const hide = message.loading(<FormattedMessage id="deleting" defaultMessage="Deleting..." />);
  if (!ids) return true;
  try {
    await removeItem('/energy-usages', {
      ids,
    });
    hide();
    message.success(<FormattedMessage id="delete_successful" defaultMessage="Delete successful" />);
    return true;
  } catch (error: any) {
    hide();
    message.error(
      error?.response?.data?.message ?? (
        <FormattedMessage id="delete_failed" defaultMessage="Delete failed, please try again" />
      ),
    );
    return false;
  }
};

const TableList: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.ItemData>();
  const [selectedRowsState, setSelectedRows] = useState<API.ItemData[]>([]);
  const access = useAccess();

  const columns: ProColumns<API.ItemData>[] = [
    // packageUsageRecord
    {
      title: intl.formatMessage({ id: 'packageUsageRecord', defaultMessage: '套餐使用记录' }),
      dataIndex: 'packageUsageRecord',
      renderText: (_, record) => {
        return record.packageUsageRecord.id;
      },
    },
    {
      title: intl.formatMessage({ id: 'bot' }),
      dataIndex: 'bot',
      hideInSearch: true,
      renderText: (_, record) => {
        return record.bot?.botName;
      },
    },
    {
      title: intl.formatMessage({ id: 'botUser' }),
      dataIndex: 'botUser',
      hideInSearch: true,
      renderText: (_, record) => {
        return record.botUser?.userName;
      },
    },
    {
      title: intl.formatMessage({ id: 'proxy' }),
      dataIndex: 'proxy',
      hideInSearch: true,
      renderText: (_, record) => {
        return record.proxy?.name;
      },
    },
    {
      title: intl.formatMessage({ id: 'address', defaultMessage: '被监控的地址' }),
      dataIndex: 'address',
      copyable: true,
    },
    // to_address
    {
      title: intl.formatMessage({ id: 'to_address', defaultMessage: '接收地址' }),
      dataIndex: 'to_address',
      copyable: true,
      hideInSearch: true,
    },
    // type
    {
      title: intl.formatMessage({ id: 'packageUsageRecord.columns.type' }),
      dataIndex: 'type',
      valueEnum: PackageUsageTypeEnum,
    },
    {
      title: intl.formatMessage({ id: 'energy', defaultMessage: '消耗能量' }),
      dataIndex: 'energy',
      hideInSearch: true,
    },
    // bandWidth
    {
      title: intl.formatMessage({ id: 'bandwidth', defaultMessage: '消耗带宽' }),
      dataIndex: 'bandwidth',
      hideInSearch: true,
    },
    // amount
    {
      title: intl.formatMessage({ id: 'amount', defaultMessage: '金额' }),
      dataIndex: 'amount',
      hideInSearch: true,
    },
    // pens
    {
      title: intl.formatMessage({ id: 'pens', defaultMessage: '笔数' }),
      dataIndex: 'pens',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'isRecycled', defaultMessage: '是否回收' }),
      dataIndex: 'isRecycled',
      renderText: (_, record) => {
        return record?.isRecycled ? (
          <Badge status="success" text="已回收" />
        ) : (
          <Badge status="error" text="未回收" />
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'tx_id', defaultMessage: '交易哈希' }),
      dataIndex: 'tx_id',
      copyable: true,
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'transactionAt', defaultMessage: '交易时间' }),
      dataIndex: 'transactionAt',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    // createdAt
    {
      title: intl.formatMessage({ id: 'createdAt', defaultMessage: '创建时间' }),
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      hideInSearch: true,
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
        access.canDeleteEnergyUsage && (
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
        headerTitle={intl.formatMessage({ id: 'energyUsage.list', defaultMessage: '能量消耗记录' })}
        actionRef={actionRef}
        rowKey="_id"
        scroll={{ x: 'max-content' }}
        search={{
          labelWidth: 120,
          collapsed: false,
        }}
        request={(params, sort, filter) => queryList('/energy-usages', { ...params }, sort, filter)}
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
          {access.canDeleteEnergyUsage && (
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
