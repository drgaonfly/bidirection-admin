import { useIntl } from '@umijs/max';
import React from 'react';
import { ProForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Form, Input } from 'antd';
import WalletSelect from '@/components/walletCustomerSelect';

interface Props {
  newRecord?: boolean;
  onFinish: (formData: any) => Promise<void>;
  values?: any;
}

const BasicForm: React.FC<Props> = ({ newRecord, onFinish, values }) => {
  const intl = useIntl();
  const [form] = Form.useForm();

  return (
    <ProForm
      form={form}
      initialValues={{
        ...values,
      }}
      onFinish={onFinish}
      submitter={{
        render: (props, dom) => {
          return (
            <div style={{ textAlign: 'right' }}>
              {dom.map((button, index) => (
                <span key={index} style={{ marginLeft: 8 }}>
                  {button}
                </span>
              ))}
            </div>
          );
        },
      }}
    >
      <ProForm.Group>
        <WalletSelect />

        <ProFormText
          rules={[{ required: true }]}
          width="md"
          label={intl.formatMessage({ id: 'paymentAddress' })}
          name="receivingAddress"
        />

        <ProFormSelect
          width="md"
          label={intl.formatMessage({ id: 'currency' })}
          name="currency"
          options={[
            { label: intl.formatMessage({ id: 'usdt' }), value: 'USDT' },
            { label: intl.formatMessage({ id: 'pledgeBalance' }), value: 'PledgeBalance' },
          ]}
        />

        <ProFormSelect
          width="md"
          label={intl.formatMessage({ id: 'walletDealType' })}
          name="type"
          options={[
            { label: intl.formatMessage({ id: 'collection' }), value: 'collection' },
            { label: intl.formatMessage({ id: 'stacking' }), value: 'staking' },
            { label: intl.formatMessage({ id: 'withdraw' }), value: 'withdrawal' },
          ]}
        />

        <ProFormSelect
          width="md"
          label={intl.formatMessage({ id: 'status' })}
          name="status"
          options={[
            { label: intl.formatMessage({ id: 'pending' }), value: 'pending' },
            { label: intl.formatMessage({ id: 'success' }), value: 'success' },
            { label: intl.formatMessage({ id: 'fail' }), value: 'fail' },
          ]}
        />
      </ProForm.Group>

      {!newRecord && (
        <Form.Item name="_id" label={false}>
          <Input type="hidden" />
        </Form.Item>
      )}
    </ProForm>
  );
};

export default BasicForm;
