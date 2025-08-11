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
import DecutionStatusEnum from '../../enums/deductionStatus';

const handleRemove = async (ids: string[]) => {
  const hide = message.loading(<FormattedMessage id="deleting" defaultMessage="Deleting..." />);
  if (!ids) return true;
  try {
    await removeItem('/deductions', {
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
      title: intl.formatMessage({ id: 'id' }),
      dataIndex: 'id',
      copyable: true,
    },
    {
      title: intl.formatMessage({ id: 'amount' }),
      dataIndex: 'amount',
      hideInSearch: true,
      renderText: (text, record) => `${text} ${record.currency || 'TRX'}`,
    },
    {
      title: intl.formatMessage({ id: 'currency', defaultMessage: '币种' }),
      dataIndex: 'currency',
      hideInSearch: true,
      valueEnum: {
        USDT: { text: 'USDT', status: 'success' },
        TRX: { text: 'TRX', status: 'processing' },
        BTC: { text: 'BTC', status: 'warning' },
        ETH: { text: 'ETH', status: 'default' },
      },
    },
    {
      title: intl.formatMessage({ id: 'reason', defaultMessage: '扣款原因' }),
      dataIndex: 'reason',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'type', defaultMessage: '扣款类型' }),
      dataIndex: 'type',
      hideInSearch: true,
      valueEnum: {
        rental: {
          text: intl.formatMessage({ id: 'rental', defaultMessage: '租赁' }),
          status: 'warning',
        },
        Rental: {
          text: intl.formatMessage({ id: 'rental', defaultMessage: '租赁' }),
          status: 'warning',
        },
        recharge: {
          text: intl.formatMessage({ id: 'recharge', defaultMessage: '充值' }),
          status: 'success',
        },
      },
    },
    {
      title: intl.formatMessage({ id: 'status' }),
      dataIndex: 'status',
      hideInSearch: true,
      valueEnum: DecutionStatusEnum,
    },
    {
      title: intl.formatMessage({ id: 'from_address', defaultMessage: '扣款来源地址' }),
      dataIndex: 'from_address',
      ellipsis: true,
      hideInSearch: true,
      copyable: true,
    },
    {
      title: intl.formatMessage({ id: 'to_address', defaultMessage: '扣款目标地址' }),
      dataIndex: 'to_address',
      ellipsis: true,
      hideInSearch: true,
      copyable: true,
    },
    {
      title: intl.formatMessage({ id: 'balance_before_deducted', defaultMessage: '扣款前余额' }),
      dataIndex: 'balance_before',
      hideInSearch: true,
      renderText: (text, record) => (text ? `${text} ${record.currency || 'TRX'}` : '-'),
    },
    {
      title: intl.formatMessage({ id: 'balance_after_deducted', defaultMessage: '扣款后余额' }),
      dataIndex: 'balance_after',
      hideInSearch: true,
      renderText: (text, record) => (text ? `${text} ${record.currency || 'TRX'}` : '-'),
    },
    {
      title: intl.formatMessage({ id: 'remark', defaultMessage: '备注' }),
      dataIndex: 'remark',
      ellipsis: true,
      hideInSearch: true,
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
      title: intl.formatMessage({ id: 'processedAt', defaultMessage: '处理时间' }),
      dataIndex: 'processedAt',
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
        headerTitle={intl.formatMessage({ id: 'deduction-list', defaultMessage: '扣款记录列表' })}
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
                label: <FormattedMessage id="processing" defaultMessage="processing" />,
                key: 'processing',
              },
              {
                label: <FormattedMessage id="completed" defaultMessage="completed" />,
                key: 'completed',
              },
              {
                label: <FormattedMessage id="failed" defaultMessage="failed" />,
                key: 'failed',
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
          queryList('/deductions', { ...params, status: activeKey }, sort, filter)
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
