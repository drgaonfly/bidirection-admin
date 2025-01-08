import { ProFormSelect } from '@ant-design/pro-components';
import React from 'react';
import { useIntl } from '@umijs/max';
import useQueryList from '@/hooks/useQueryList';

interface Props {
  newRecord?: boolean;
  onChange?: (value: string) => void;
}

const WalletSelect: React.FC<Props> = ({ newRecord = true, onChange }) => {
  const intl = useIntl();
  const { items: wallet, loading } = useQueryList('/wallets');

  return (
    <ProFormSelect
      rules={[{ required: true }]}
      options={wallet.map((wallet: any) => ({
        label: wallet._id, //编号
        value: wallet._id,
      }))}
      width="md"
      name="wallet"
      label={intl.formatMessage({ id: 'wallet' })}
      showSearch
      fieldProps={{
        loading,
        onChange: (value: string) => {
          console.log('Selected wallet value:', value);
          if (onChange) {
            onChange(value);
          }
        },
      }}
      disabled={!newRecord}
    />
  );
};

export default WalletSelect;
