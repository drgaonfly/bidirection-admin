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
import RntalStatusEnum from '../../enums/rentalStatus';

const handleRemove = async (ids: string[]) => {
  const hide = message.loading(<FormattedMessage id="deleting" defaultMessage="Deleting..." />);
  if (!ids) return true;
  try {
    await removeItem('/rentals', {
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

const handleRecycling = async (fields: any) => {
  const hide = message.loading(<FormattedMessage id="updating" defaultMessage="Updating..." />);
  try {
    await updateItem(`/rentals/${fields._id}/recycling`, fields);
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
  const currentDate = new Date();
  const access = useAccess();

  const columns: ProColumns<API.ItemData>[] = [
    {
      title: intl.formatMessage({ id: 'proxy', defaultMessage: '代理' }),
      dataIndex: 'proxy',
      hideInSearch: true,
      renderText: (_, record) => {
        return record.proxy?.name;
      },
    },
    {
      title: intl.formatMessage({ id: 'user', defaultMessage: '用户' }),
      dataIndex: 'botUser',
      copyable: true,
      renderText: (botUser) => {
        if (!botUser) return '-';
        return (
          botUser.userName ||
          botUser.displayName ||
          `${botUser.firstName ?? ''} ${botUser.lastName ?? ''}`.trim()
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'bot', defaultMessage: '机器人' }),
      dataIndex: 'bot',
      copyable: true,
      renderText: (text, record) => {
        return record.bot?.botName;
      },
    },
    {
      title: intl.formatMessage({ id: 'energySendAddress', defaultMessage: '能量发送地址' }),
      dataIndex: 'energySendAddress',
      copyable: true,
    },
    {
      title: intl.formatMessage({ id: 'energyFromAddress', defaultMessage: '能量来源地址' }),
      dataIndex: 'energyFromAddress',
      copyable: true,
    },
    {
      title: intl.formatMessage({ id: 'from_address', defaultMessage: 'From' }),
      dataIndex: 'from_address',
      copyable: true,
    },
    {
      title: intl.formatMessage({ id: 'to_address', defaultMessage: 'To' }),
      dataIndex: 'to_address',
      copyable: true,
    },
    {
      title: intl.formatMessage({ id: 'energy', defaultMessage: '能量' }),
      dataIndex: 'amount',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'separation', defaultMessage: '笔数' }),
      dataIndex: 'separation',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'price', defaultMessage: '价格(TRX)' }),
      dataIndex: 'price',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'crypto_type', defaultMessage: '币种' }),
      dataIndex: 'crypto_type',
      hideInSearch: true,
      valueEnum: {
        trx: { text: 'TRX' },
        usdt: { text: 'USDT' },
      },
    },
    // hash
    {
      title: intl.formatMessage({ id: 'transfer_in_hash', defaultMessage: '转账哈希' }),
      dataIndex: 'hash',
      ellipsis: true,
      copyable: true,
    },
    {
      title: intl.formatMessage({ id: 'transfer_out_hash', defaultMessage: '发送哈希' }),
      dataIndex: 'tx_id',
      ellipsis: true,
      copyable: true,
    },
    {
      title: intl.formatMessage({ id: 'type', defaultMessage: '类型' }),
      dataIndex: 'type',
      hideInSearch: true,
      valueEnum: {
        manual: { text: '手动' },
        bot: { text: '机器人' },
        auto: { text: '自动' },
      },
    },
    {
      title: intl.formatMessage({ id: 'status', defaultMessage: '状态' }),
      dataIndex: 'status',
      hideInSearch: true,
      valueEnum: RntalStatusEnum,
    },
    {
      title: intl.formatMessage({ id: 'createdAt', defaultMessage: '创建时间' }),
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'rentedAt', defaultMessage: '租赁时间' }),
      dataIndex: 'transactionAt',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'recycledAt', defaultMessage: '回收时间' }),
      dataIndex: 'endAt',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'expiredAt', defaultMessage: '过期时间' }),
      dataIndex: 'expiredAt',
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
        access.canDeleteRental && (
          <DeleteLink
            key="delete"
            onOk={async () => {
              await handleRemove([record._id!]);
              actionRef.current?.reload();
            }}
          />
        ),
        new Date(currentDate).getTime() - new Date(record?.endAt ? record?.endAt : 0).getTime() >
          record?.limit_hour * 60 * 60 * 1000 &&
          access.canRecycling &&
          record.status !== 'recycled' && (
            <a
              key="recycling"
              onClick={async () => {
                setCurrentRow(record);
                await handleRecycling(record._id!);
              }}
            >
              <FormattedMessage id="recycling" defaultMessage="回收" />
            </a>
          ),
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.ItemData, API.PageParams>
        headerTitle={intl.formatMessage({ id: 'rental.list', defaultMessage: '能量租用订单' })}
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
                label: <FormattedMessage id="platform.all" defaultMessage="全部" />,
                key: '',
              },
              {
                label: <FormattedMessage id="pending" defaultMessage="待处理" />,
                key: 'pending',
              },
              {
                label: <FormattedMessage id="completed" defaultMessage="已完成" />,
                key: 'completed',
              },
              {
                label: <FormattedMessage id="cancelled" defaultMessage="已取消" />,
                key: 'cancelled',
              },
              {
                label: <FormattedMessage id="expired" defaultMessage="已过期" />,
                key: 'expired',
              },
              {
                label: <FormattedMessage id="recycled" defaultMessage="已回收" />,
                key: 'recycled',
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
          queryList('/rentals', { ...params, status: activeKey }, sort, filter)
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
          {access.canDeleteRental && (
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
