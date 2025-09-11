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
    await removeItem('/premiums', {
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
  const actionRef = useRef<ActionType>();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<string | undefined>('');
  const [currentRow, setCurrentRow] = useState<API.ItemData>();
  const [selectedRowsState, setSelectedRows] = useState<API.ItemData[]>([]);
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
      title: intl.formatMessage({ id: 'user' }),
      dataIndex: 'botUser',
      hideInSearch: true,
      renderText: (text, record) => {
        return record.botUser?.userName;
      },
    },
    {
      title: intl.formatMessage({ id: 'bot' }),
      dataIndex: 'bot',
      hideInSearch: true,
      renderText: (text, record) => {
        return record.bot?.botName;
      },
    },
    {
      title: intl.formatMessage({ id: 'id', defaultMessage: '订单ID' }),
      dataIndex: 'id',
      copyable: true,
    },
    {
      title: intl.formatMessage({ id: 'amount', defaultMessage: '金额' }),
      dataIndex: 'amount',
      hideInSearch: true,
      renderText: (text) => `${text} USDT`,
    },
    {
      title: intl.formatMessage({ id: 'actualAmount', defaultMessage: '实际收款金额' }),
      dataIndex: 'actualAmount',
      hideInSearch: true,
      renderText: (text) => (text ? `${text} USDT` : '-'),
    },
    {
      title: intl.formatMessage({ id: 'months', defaultMessage: '会员月数' }),
      dataIndex: 'months',
      hideInSearch: true,
      renderText: (text) => `${text}个月`,
    },
    {
      title: intl.formatMessage({ id: 'status', defaultMessage: '状态' }),
      dataIndex: 'status',
      hideInSearch: true,
      valueEnum: {
        pending: { text: intl.formatMessage({ id: 'pending' }), status: 'warning' },
        paid: { text: intl.formatMessage({ id: 'paid' }), status: 'success' },
        expired: { text: intl.formatMessage({ id: 'expired' }), status: 'error' },
        cancelled: { text: intl.formatMessage({ id: 'cancelled' }), status: 'default' },
      },
    },
    {
      title: intl.formatMessage({ id: 'from', defaultMessage: '付款地址' }),
      dataIndex: 'from',
      ellipsis: true,
      hideInSearch: true,
      copyable: true,
    },
    {
      title: intl.formatMessage({ id: 'to', defaultMessage: '收款地址' }),
      dataIndex: 'to',
      ellipsis: true,
      hideInSearch: true,
      copyable: true,
    },
    {
      title: intl.formatMessage({ id: 'hash', defaultMessage: '交易哈希' }),
      dataIndex: 'hash',
      ellipsis: true,
      hideInSearch: true,
      copyable: true,
    },
    {
      title: intl.formatMessage({ id: 'createdAt' }),
      dataIndex: 'createdAt',
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
        access.canDeletePremium && (
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
          collapsed: true,
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
                label: <FormattedMessage id="pending" defaultMessage="待支付" />,
                key: 'pending',
              },
              {
                label: <FormattedMessage id="paid" defaultMessage="已支付" />,
                key: 'paid',
              },
              {
                label: <FormattedMessage id="expired" defaultMessage="已过期" />,
                key: 'expired',
              },
              {
                label: <FormattedMessage id="cancelled" defaultMessage="已取消" />,
                key: 'cancelled',
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
        request={(params, sort, filter) => {
          const queryParams = { ...params } as any;
          if (activeKey) {
            queryParams.status = activeKey;
          }
          return queryList('/premiums', queryParams, sort, filter);
        }}
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
          {access.canDeletePremium && (
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
