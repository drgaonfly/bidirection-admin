import { ProFormSelect } from '@ant-design/pro-components';
import React from 'react';
import { useAccess, useIntl } from '@umijs/max';
import useQueryList from '@/hooks/useQueryList';

const UserSelect: React.FC = () => {
  const intl = useIntl();
  const access = useAccess();
  const { items: users, loading } = useQueryList('/users', access.canAdmin);

  const filteredUsers = users.filter(
    (user: any) =>
      user.role !== 'ADMIN' && user.role !== 'ORDER_PLACER' && user.role !== 'REVIEWER',
  );

  return (
    <ProFormSelect
      rules={[{ required: true }]}
      options={filteredUsers.map((user: any) => ({
        label: user.name,
        value: user._id,
      }))}
      width="md"
      name="user"
      label={intl.formatMessage({ id: 'user' })}
      showSearch
      fieldProps={{ loading }}
    />
  );
};

export default UserSelect;
