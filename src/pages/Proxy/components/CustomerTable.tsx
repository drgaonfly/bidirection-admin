import React from 'react';
import { EditableProTable, ProColumns } from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { useIntl } from '@umijs/max';

interface CustomerTableProps {
  customers: API.ItemData[];
  loading: boolean;
  paging: { current: number; pageSize: number };
  setPaging: (paging: { current: number; pageSize: number }) => void;
}

const CustomerTable: React.FC<CustomerTableProps> = ({ customers, loading, paging, setPaging }) => {
  const intl = useIntl();
  const customersColumns: ProColumns<API.ItemData>[] = [
    {
      title: intl.formatMessage({ id: 'phone' }),
      dataIndex: 'phoneNumber',
      copyable: true,
    },
    {
      title: intl.formatMessage({ id: 'isOnline' }),
      dataIndex: 'isOnline',
      render: (_, record: any) => (
        <span>
          {record.isOnline
            ? intl.formatMessage({ id: 'platform.online' })
            : intl.formatMessage({ id: 'platform.offline' })}
        </span>
      ),
    },
    {
      title: intl.formatMessage({ id: 'createdAt' }),
      dataIndex: 'createdAt',
      copyable: true,
    },
  ];

  return (
    <EditableProTable<API.ItemData>
      rowKey="_id"
      headerTitle={<FormattedMessage id="show.customers" defaultMessage="鱼儿" />}
      columns={customersColumns}
      value={customers}
      loading={loading}
      recordCreatorProps={false}
      style={{ marginTop: '20px' }}
      pagination={{
        ...paging,
        total: customers.length,
        onChange: (page: any, pageSize: any) => {
          setPaging({ current: page, pageSize });
        },
      }}
    />
  );
};

export default CustomerTable;
