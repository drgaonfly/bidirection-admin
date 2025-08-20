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
    await removeItem('/min-consumptions', {
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
  const actionRef = useRef<ActionType>();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.ItemData>();
  const [selectedRowsState, setSelectedRows] = useState<API.ItemData[]>([]);

  const access = useAccess();

  const columns: ProColumns<API.ItemData>[] = [
    {
      title: intl.formatMessage({ id: 'bot', defaultMessage: 'Bot' }),
      dataIndex: 'bot',
      width: 120,
      renderText: (_, record) => record.bot?.botName,
    },
    {
      title: intl.formatMessage({ id: 'user', defaultMessage: 'User' }),
      dataIndex: 'botUser',
      width: 120,
      renderText: (_, record) => record.botUser?.userName,
    },
    {
      title: intl.formatMessage({ id: 'proxy', defaultMessage: 'Proxy' }),
      dataIndex: 'proxy',
      width: 120,
      renderText: (_, record) => record.proxy?.name,
    },
    {
      title: intl.formatMessage({
        id: 'packageUsageRecord',
        defaultMessage: 'Package Usage Record',
      }),
      dataIndex: 'packageUsageRecord',
      width: 120,
      renderText: (_, record) => record.packageUsageRecord?.id,
    },
    {
      title: intl.formatMessage({ id: 'times', defaultMessage: 'times' }),
      dataIndex: 'pens',
      valueType: 'digit',
      hideInSearch: true,
      width: 100,
    },
    {
      title: intl.formatMessage({ id: 'energy', defaultMessage: 'Energy' }),
      dataIndex: 'energy',
      hideInSearch: true,
      valueType: 'digit',
      width: 100,
    },
    {
      title: intl.formatMessage({ id: 'txHash', defaultMessage: 'Tx ID' }),
      dataIndex: 'tx_id',
      hideInSearch: true,
      hideInTable: true,
      width: 200,
      ellipsis: true,
      copyable: true,
    },
    {
      title: intl.formatMessage({ id: 'createdAt', defaultMessage: 'Created At' }),
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
      width: 120,
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
        access.canDeleteMinConsumption && (
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
        headerTitle={intl.formatMessage({ id: 'list', defaultMessage: 'Min Consumption List' })}
        actionRef={actionRef}
        rowKey="_id"
        scroll={{ x: 'max-content' }}
        search={{
          labelWidth: 120,
          collapsed: false,
        }}
        toolBarRender={() => []}
        request={(params, sort, filter) =>
          queryList('/min-consumptions', { ...params }, sort, filter)
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
          {access.canDeleteMinConsumption && (
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
