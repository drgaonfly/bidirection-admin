import React from 'react';
import { ProForm, ProFormDigit, ProFormSelect } from '@ant-design/pro-components';
import { Form, Input } from 'antd';
import { queryList } from '@/services/ant-design-pro/api';

interface Props {
  newRecord?: boolean;
  onFinish: (formData: any) => Promise<void>;
  values?: any;
}

const BasicForm: React.FC<Props> = ({ newRecord, onFinish, values }) => {
  return (
    <ProForm
      initialValues={{
        timeoutMinutes: 60,
        ...values,
        botId: values?.bot?._id ?? values?.botId,
      }}
      onFinish={async (formData) => {
        await onFinish(formData);
      }}
      submitter={{
        render: (props, dom) => (
          <div style={{ textAlign: 'right' }}>
            {dom.map((button, index) => (
              <span key={index} style={{ marginLeft: 8 }}>
                {button}
              </span>
            ))}
          </div>
        ),
      }}
    >
      <ProForm.Group>
        <ProFormSelect
          width="md"
          name="botId"
          label="机器人"
          request={async () => {
            const res = await queryList('/bots', { current: 1, pageSize: 200 });
            return (res.data ?? []).map((b: any) => ({
              label: `${b.botName} (@${b.userName})`,
              value: b._id,
            }));
          }}
          rules={[{ required: true, message: '请选择机器人' }]}
          disabled={!newRecord}
        />
        <ProFormDigit
          width="md"
          name="timeoutMinutes"
          label="订单有效期（分钟）"
          min={5}
          max={1440}
          fieldProps={{ precision: 0 }}
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
