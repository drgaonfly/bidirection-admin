import { useIntl } from '@umijs/max';
import React from 'react';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { Form, Input } from 'antd';

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
      onFinish={async (values) => {
        await onFinish({
          ...values,
        });
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
        <ProFormText
          rules={[{ required: true }]}
          width="md"
          label={intl.formatMessage({ id: 'investBalance' })}
          name="investBalance"
        />

        <ProFormText
          rules={[{ required: true }]}
          width="md"
          label={intl.formatMessage({ id: 'rateOfReturn' })}
          name="rateOfReturn"
        />

        <ProFormText
          rules={[{ required: true }]}
          width="md"
          label={intl.formatMessage({ id: 'profit' })}
          name="profit"
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
