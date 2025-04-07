import { useIntl } from '@umijs/max';
import React from 'react';
import { ProForm, ProFormText } from '@ant-design/pro-components';
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
          rules={[{ required: false }]}
          width="md"
          label={intl.formatMessage({ id: 'paymentAddress' })}
          name="paymentAddress"
        />
        <ProFormText
          rules={[{ required: false }]}
          width="md"
          label={intl.formatMessage({ id: 'balance' })}
          name="balance"
        />
        <ProFormText
          rules={[{ required: false }]}
          width="md"
          label={intl.formatMessage({ id: 'hash' })}
          name="hash"
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
