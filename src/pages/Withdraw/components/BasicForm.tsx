import { useIntl } from '@umijs/max';
import React from 'react';
import { ProForm, ProFormSelect, ProFormText, ProFormDigit } from '@ant-design/pro-components';
import { Form, Input } from 'antd';

interface Props {
  newRecord?: boolean;
  onFinish: (formData: any) => Promise<void>;
  values?: any;
  balanceData?: {
    usdt_balance: number;
    trx_balance: number;
  };
}

const BasicForm: React.FC<Props> = ({ newRecord, onFinish, values, balanceData }) => {
  const intl = useIntl();
  const [form] = Form.useForm();

  return (
    <ProForm
      form={form}
      initialValues={{
        ...values,
      }}
      onFinish={async (values) => {
        await onFinish({
          ...values,
        });
      }}
      onValuesChange={(changedValues) => {
        if (changedValues.type) {
          // 当类型改变时，重新验证金额
          form.validateFields(['amount']);
        }
      }}
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
        <ProFormDigit
          name="amount"
          width="md"
          label={intl.formatMessage({ id: 'amount', defaultMessage: '金额' })}
          min={0}
          precision={2}
          fieldProps={{
            controls: false,
          }}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'amountRequired', defaultMessage: '请输入金额' }),
            },
            {
              validator: async (_: any, value: number) => {
                if (!value) return Promise.resolve();

                const type = form.getFieldValue('type');

                if (!balanceData) {
                  return Promise.reject(new Error('余额数据加载中...'));
                }

                if (type === 'usdt_balance' && value > balanceData.usdt_balance) {
                  return Promise.reject(
                    new Error(`USDT余额不足，当前余额: ${balanceData.usdt_balance}`),
                  );
                }

                if (type === 'trx_balance' && value > balanceData.trx_balance) {
                  return Promise.reject(
                    new Error(`TRX余额不足，当前余额: ${balanceData.trx_balance}`),
                  );
                }

                return Promise.resolve();
              },
            },
          ]}
        />
        <ProFormSelect
          name="type"
          width="md"
          label={intl.formatMessage({ id: 'type', defaultMessage: '类型' })}
          options={[
            { label: 'USDT余额', value: 'usdt_balance' },
            { label: 'TRX余额', value: 'trx_balance' },
          ]}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'typeRequired', defaultMessage: '请选择类型' }),
            },
          ]}
        />

        {/* address */}
        <ProFormText
          name="address"
          width="md"
          label={intl.formatMessage({ id: 'address', defaultMessage: '提现地址' })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'addressRequired',
                defaultMessage: '请输入提现地址',
              }),
            },
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
