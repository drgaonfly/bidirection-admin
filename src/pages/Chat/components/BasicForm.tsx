import { useIntl } from '@umijs/max';
import React from 'react';
import { ProForm, ProFormText, ProFormGroup } from '@ant-design/pro-components';
import { Form, Input } from 'antd';
import { FormInstance } from 'antd/es/form';

interface Props {
  form?: FormInstance<any>;
  newRecord?: boolean;
  onFinish: (formData: any) => Promise<void>;
  values?: any;
}

const BasicForm: React.FC<Props> = ({ newRecord, onFinish, values }) => {
  const intl = useIntl();

  return (
    <ProFormGroup>
      <ProForm
        initialValues={{
          ...values,
        }}
        onFinish={async (values) => {
          await onFinish(values);
        }}
      >
        <ProFormText width="md" name="name" label={intl.formatMessage({ id: 'region.name' })} />

        {!newRecord && (
          <Form.Item name="_id" label={false}>
            <Input type="hidden" />
          </Form.Item>
        )}
      </ProForm>
    </ProFormGroup>
  );
};

export default BasicForm;
