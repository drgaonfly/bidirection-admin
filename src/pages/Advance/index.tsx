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
    await removeItem('/advances', {
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
  const [activeKey, setActiveKey] = useState<string | undefined>('');
  const actionRef = useRef<ActionType>();
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
      title: intl.formatMessage({ id: 'id' }),
      dataIndex: 'id',
      copyable: true,
    },
    {
      title: intl.formatMessage({ id: 'amount' }),
      dataIndex: 'amount',
      hideInSearch: true,
      renderText: (text) => `${text} USDT`,
    },
    {
      title: intl.formatMessage({ id: 'from-address', defaultMessage: '发送地址' }),
      dataIndex: 'from_address',
      ellipsis: true,
      hideInSearch: true,
      copyable: true,
    },
    {
      title: intl.formatMessage({ id: 'to-address', defaultMessage: '接收地址' }),
      dataIndex: 'to_address',
      ellipsis: true,
      hideInSearch: true,
      copyable: true,
    },
    {
      title: intl.formatMessage({ id: 'consumption_energy', defaultMessage: '消耗能量' }),
      dataIndex: 'consumption_energy',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'consumption_integer', defaultMessage: '消耗带宽' }),
      dataIndex: 'consumption_integer',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'tx_id', defaultMessage: '交易ID' }),
      dataIndex: 'tx_id',
      ellipsis: true,
      hideInSearch: true,
      copyable: true,
    },
    {
      title: intl.formatMessage({ id: 'status' }),
      dataIndex: 'status',
      hideInSearch: true,
      valueEnum: {
        pending: { text: intl.formatMessage({ id: 'pending' }), status: 'warning' },
        completed: { text: intl.formatMessage({ id: 'completed' }), status: 'success' },
        expired: { text: intl.formatMessage({ id: 'expired' }), status: 'error' },
        cancelled: { text: intl.formatMessage({ id: 'cancelled' }), status: 'default' },
      },
    },
    {
      title: intl.formatMessage({ id: 'crypto_type', defaultMessage: '加密货币类型' }),
      dataIndex: 'crypto_type',
      hideInSearch: true,
      valueEnum: {
        usdt: { text: 'USDT', status: 'success' },
        trx: { text: 'TRX', status: 'processing' },
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
      title: intl.formatMessage({ id: 'expiredAt', defaultMessage: '过期时间' }),
      dataIndex: 'expiredAt',
      valueType: 'dateTime',
      hideInSearch: true,
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
        access.canDeleteAdvance && (
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
                label: <FormattedMessage id="completed" defaultMessage="completed" />,
                key: 'completed',
              },
              {
                label: <FormattedMessage id="expired" defaultMessage="expired" />,
                key: 'expired',
              },
              {
                label: <FormattedMessage id="cancelled" defaultMessage="cancelled" />,
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
        request={(params, sort, filter) =>
          queryList('/advances', { ...params, status: activeKey }, sort, filter)
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
          {access.canDeleteAdvance && (
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
