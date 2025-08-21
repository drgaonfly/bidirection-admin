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
import UnrentalStatusEnum from '../../../enums/unrentalStatus';

const handleRemove = async (ids: string[]) => {
  const hide = message.loading(<FormattedMessage id="deleting" defaultMessage="Deleting..." />);
  if (!ids) return true;
  try {
    await removeItem('/unrentals', {
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
        return record?.proxy?.name;
      },
    },
    // 订单类型·
    {
      title: intl.formatMessage({ id: 'order_type', defaultMessage: '订单类型' }),
      hideInSearch: true,
      renderText: (_, record) => {
        return record?.rental ? '闪租' : '日租';
      },
    },
    {
      title: intl.formatMessage({ id: 'rental', defaultMessage: '租用订单' }),
      dataIndex: 'rental',
      hideInSearch: true,
      renderText: (_, record) => {
        return record?.rental?._id || record?.packageUsageRecord.packageOrder.id;
      },
    },
    {
      title: intl.formatMessage({ id: 'energySendAddress', defaultMessage: '能量发送地址' }),
      dataIndex: 'energySendAddress',
      copyable: true,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'from_address', defaultMessage: 'From' }),
      dataIndex: 'from',
      copyable: true,
    },
    {
      title: intl.formatMessage({ id: 'to_address', defaultMessage: 'To' }),
      dataIndex: 'to',
      copyable: true,
    },
    {
      title: intl.formatMessage({ id: 'status', defaultMessage: '状态' }),
      dataIndex: 'status',
      hideInSearch: true,
      valueEnum: UnrentalStatusEnum,
    },
    {
      title: intl.formatMessage({ id: 'hash', defaultMessage: '哈希' }),
      dataIndex: 'hash',
      ellipsis: true,
      copyable: true,
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
      ],
    },
    {
      title: intl.formatMessage({ id: 'energy', defaultMessage: '能量' }),
      dataIndex: 'amount',
      hideInSearch: true,
      renderText: (_, record) => record?.amount,
    },
    {
      title: intl.formatMessage({ id: 'separation', defaultMessage: '笔数' }),
      dataIndex: 'separation',
      hideInSearch: true,
      renderText: (_, record) => record?.separation,
    },
    {
      title: intl.formatMessage({ id: 'limit_hour', defaultMessage: '时长(小时)' }),
      dataIndex: 'limit_hour',
      hideInSearch: true,
      renderText: (_, record) => record?.limit_hour,
    },
    {
      title: intl.formatMessage({ id: 'price', defaultMessage: '价格' }),
      dataIndex: 'price',
      hideInSearch: true,
      renderText: (_, record) => record?.price,
    },
    {
      title: intl.formatMessage({ id: 'createdAt' }),
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      hideInSearch: true,
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.ItemData, API.PageParams>
        headerTitle={intl.formatMessage({ id: 'unrental.list', defaultMessage: '能量归还订单' })}
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
                label: <FormattedMessage id="success" defaultMessage="成功" />,
                key: 'success',
              },
              {
                label: <FormattedMessage id="failed" defaultMessage="失败" />,
                key: 'failed',
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
          queryList('/unrentals', { ...params, status: activeKey }, sort, filter)
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
