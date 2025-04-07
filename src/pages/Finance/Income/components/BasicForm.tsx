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

  return (
    <ProForm
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
          label={intl.formatMessage({ id: 'usdtEarnings' })}
          name="usdtEarnings"
        />
      </ProForm.Group>

      <ProForm.Group>
        <ProFormSelect
          width="md"
          label={intl.formatMessage({ id: 'incomeType' })}
          name="type"
          options={[
            { label: intl.formatMessage({ id: 'income.flowing' }), value: 'flowing' },
            { label: intl.formatMessage({ id: 'income.stacking' }), value: 'staking' },
            { label: intl.formatMessage({ id: 'income.teamworking' }), value: 'teamworking' },
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

        <ProFormText
          rules={[{ required: false }]}
          width="md"
          label={intl.formatMessage({ id: 'remark' })}
          name="remark"
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
