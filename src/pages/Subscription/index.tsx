import React, { useRef, useState } from 'react';
import { useIntl, FormattedMessage, useAccess } from '@umijs/max';
import { addItem, queryList } from '@/services/ant-design-pro/api';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { ModalForm, PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import BasicForm from './components/BasicForm';
import Show from './components/Show';

const STATUS_TAG: Record<string, { color: string; text: string }> = {
  pending: { color: 'processing', text: '待付款' },
  paid: { color: 'success', text: '已付款' },
  expired: { color: 'default', text: '已到期' },
  timeout: { color: 'error', text: '订单超时' },
};

const handleAdd = async (fields: any) => {
  const hide = message.loading(<FormattedMessage id="adding" defaultMessage="Adding..." />);
  try {
    await addItem('/subscriptions', fields);
    hide();
    message.success(<FormattedMessage id="add_successful" defaultMessage="Added successfully" />);
    return true;
  } catch (error: any) {
    hide();
    message.error(
      error?.response?.data?.message ?? (
        <FormattedMessage id="upload_failed" defaultMessage="Upload failed, please try again!" />
      ),
    );
    return false;
  }
};

const SubscriptionList: React.FC = () => {
  const intl = useIntl();
  const access = useAccess();
  const actionRef = useRef<ActionType>();
  const [activeKey, setActiveKey] = useState<string>('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [currentRow, setCurrentRow] = useState<any>();

  const columns: ProColumns<any>[] = [
    {
      title: intl.formatMessage({ id: 'bot', defaultMessage: '机器人' }),
      dataIndex: 'bot',
      renderText: (bot) => bot?.botName || bot?.userName || '-',
    },
    {
      title: intl.formatMessage({ id: 'status', defaultMessage: '状态' }),
      dataIndex: 'status',
      hideInSearch: true,
      render: (_, record) => {
        const cfg = STATUS_TAG[record.status] ?? { color: 'default', text: record.status };
        return <Tag color={cfg.color}>{cfg.text}</Tag>;
      },
    },
    {
      title: intl.formatMessage({ id: 'amount', defaultMessage: '应付金额' }),
      dataIndex: 'amount',
      hideInSearch: true,
      renderText: (val) => `${val} USDT`,
    },
    {
      title: intl.formatMessage({ id: 'paidAmount', defaultMessage: '实付金额' }),
      dataIndex: 'paidAmount',
      hideInSearch: true,
      renderText: (val) => (val ? `${val} USDT` : '-'),
    },
    {
      title: intl.formatMessage({ id: 'toAddress', defaultMessage: '收款地址' }),
      dataIndex: 'toAddress',
      copyable: true,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'txHash', defaultMessage: '交易哈希' }),
      dataIndex: 'txHash',
      copyable: true,
      ellipsis: true,
      hideInSearch: true,
      renderText: (val) => val || '-',
    },
    {
      title: intl.formatMessage({ id: 'orderExpiredAt', defaultMessage: '订单过期时间' }),
      dataIndex: 'orderExpiredAt',
      hideInSearch: true,
      renderText: (val) => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: intl.formatMessage({ id: 'subscription_start', defaultMessage: '服务开始' }),
      dataIndex: 'startDate',
      hideInSearch: true,
      renderText: (val) => (val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '-'),
    },
    {
      title: intl.formatMessage({ id: 'subscription_end', defaultMessage: '服务到期' }),
      dataIndex: 'endDate',
      hideInSearch: true,
      renderText: (val) => (val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '-'),
    },
    {
      title: intl.formatMessage({ id: 'paidAt', defaultMessage: '付款时间' }),
      dataIndex: 'paidAt',
      hideInSearch: true,
      renderText: (val) => (val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '-'),
    },
    {
      title: intl.formatMessage({ id: 'createdAt', defaultMessage: '创建时间' }),
      dataIndex: 'createdAt',
      hideInSearch: true,
      renderText: (val) => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="detail"
          onClick={() => {
            setCurrentRow(record);
            setShowDetail(true);
          }}
        >
          <FormattedMessage id="platforms.detail" defaultMessage="详情" />
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<any, any>
        headerTitle={intl.formatMessage({
          id: 'subscription_list',
          defaultMessage: '话题订阅列表',
        })}
        actionRef={actionRef}
        rowKey="_id"
        scroll={{ x: 'max-content' }}
        search={{ collapsed: false, labelWidth: 120 }}
        toolBarRender={() => [
          access.canSuperAdmin && (
            <Button
              key="create"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateModalOpen(true)}
            >
              <FormattedMessage id="pages.searchTable.new" defaultMessage="新建订单" />
            </Button>
          ),
        ]}
        toolbar={{
          menu: {
            type: 'tab',
            activeKey,
            items: [
              { label: <FormattedMessage id="all" defaultMessage="全部" />, key: '' },
              { label: '待付款', key: 'pending' },
              { label: '已付款', key: 'paid' },
              { label: '已到期', key: 'expired' },
              { label: '订单超时', key: 'timeout' },
            ],
            onChange: (key: any) => {
              setActiveKey(key);
              actionRef.current?.reload();
            },
          },
        }}
        request={(params, sort, filter) =>
          queryList('/subscriptions', { ...params, status: activeKey || undefined }, sort, filter)
        }
        columns={columns}
      />

      {access.canSuperAdmin && (
        <ModalForm
          title={<FormattedMessage id="pages.searchTable.new" defaultMessage="新建话题订阅订单" />}
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
          modalProps={{ destroyOnClose: true }}
          submitter={false}
        >
          <BasicForm
            newRecord
            onFinish={async (values) => {
              const success = await handleAdd(values);
              if (success) {
                setCreateModalOpen(false);
                actionRef.current?.reload();
              }
            }}
          />
        </ModalForm>
      )}

      <Show
        open={showDetail}
        currentRow={currentRow}
        columns={columns as ProDescriptionsItemProps<any>[]}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
      />
    </PageContainer>
  );
};

export default SubscriptionList;
