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
      title: intl.formatMessage({ id: 'address', defaultMessage: '地址' }),
      dataIndex: 'address',
      copyable: true,
    },
    {
      title: intl.formatMessage({ id: 'consupmtion', defaultMessage: '消耗能量' }),
      dataIndex: 'consupmtion',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'owner_address', defaultMessage: '拥有者' }),
      dataIndex: 'owner',
      copyable: true,
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
