import { ProFormSelect } from '@ant-design/pro-components';
import React from 'react';
import { useIntl } from '@umijs/max';
import useQueryList from '@/hooks/useQueryList';

interface ProxySelectProps {
  currentUser: any;
}

const ProxySelect: React.FC<ProxySelectProps> = ({ currentUser }) => {
  const intl = useIntl();
  const { items: users, loading } = useQueryList('/users');

  const filteredUsers = users.filter(
    (user: any) => user.role !== 'ADMIN' && (!currentUser || user._id !== currentUser._id),
  );

  return (
    <ProFormSelect
      rules={[{ required: false }]}
      options={filteredUsers.map((user: any) => ({
        label: user.name,
        value: user._id,
      }))}
      width="md"
      name="proxy"
      label={intl.formatMessage({ id: 'superior' })}
      showSearch
      fieldProps={{ loading }}
    />
  );
};

export default ProxySelect;
