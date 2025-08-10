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
    await removeItem('/member-orders', {
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
      dataIndex: ['proxy', 'name'],
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: intl.formatMessage({ id: 'orderNumber' }),
      dataIndex: 'orderNumber',
      copyable: true,
    },
    {
      title: intl.formatMessage({ id: 'amount' }),
      dataIndex: 'amount',
      hideInSearch: true,
      renderText: (text) => `${text} USDT`,
    },
    {
      title: intl.formatMessage({ id: 'actualAmount', defaultMessage: '实际收款金额' }),
      dataIndex: 'actualAmount',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'membershipType', defaultMessage: '会员类型' }),
      dataIndex: 'membershipType',
      hideInSearch: true,
      renderText: (text) => {
        if (text === '3m') return '3月会员';
        if (text === '6m') return '6月会员';
        if (text === '1y') return '1年会员';
        return text;
      },
    },
    {
      title: intl.formatMessage({ id: 'status' }),
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
      title: intl.formatMessage({ id: 'paymentAddress', defaultMessage: '收款地址' }),
      dataIndex: 'paymentAddress',
      ellipsis: true,
      hideInSearch: true,
      copyable: true,
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
      title: intl.formatMessage({ id: 'hasPurchased', defaultMessage: '是否已购买' }),
      dataIndex: 'hasPurchased',
      hideInSearch: true,
      copyable: true,
      render: (text) => {
        if (text === true) {
          return (
            <span style={{ color: 'green' }}>
              {intl.formatMessage({ id: 'paid', defaultMessage: '已购买' })}
            </span>
          );
        }
        return <span>{intl.formatMessage({ id: 'notPaid', defaultMessage: '未购买' })}</span>;
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
      title: intl.formatMessage({ id: 'createdAt' }),
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'endDate', defaultMessage: '结束日期' }),
      dataIndex: 'endDate',
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
        access.canDeleteMemberOrder && (
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
                label: <FormattedMessage id="platform.all" defaultMessage="all" />,
                key: '',
              },
              {
                label: <FormattedMessage id="pending" defaultMessage="pending" />,
                key: 'pending',
              },
              {
                label: <FormattedMessage id="paid" defaultMessage="paid" />,
                key: 'paid',
              },
              {
                label: <FormattedMessage id="expired" defaultMessage="expired" />,
                key: 'expired',
              },
              {
                label: <FormattedMessage id="canceled" defaultMessage="canceled" />,
                key: 'canceled',
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
          queryList('/member-orders', { ...params, status: activeKey }, sort, filter)
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
          {access.canDeleteMemberOrder && (
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
