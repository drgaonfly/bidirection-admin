import { useIntl } from '@umijs/max';
import React from 'react';
import { ProForm, ProFormText, ProFormCheckbox } from '@ant-design/pro-components';
import { Form, Input } from 'antd';
import useQueryList from '@/hooks/useQueryList';

interface Props {
  newRecord?: boolean;
  onFinish: (formData: any) => Promise<void>;
  values?: any;
}

const BasicForm: React.FC<Props> = ({ newRecord, onFinish, values }) => {
  const intl = useIntl();

  const { items: roles, loading } = useQueryList('/roles');
  const filteredRoles = roles?.filter((role: { name: string }) => role.name === '代理'); // 只筛选出名称为代理的角色

  return (
    <ProForm
      initialValues={{
        ...values,
        roles: values?.roles?.map((role: { _id: string }) => role._id),
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
          label={intl.formatMessage({ id: 'name' })}
          name="name"
        />
        <ProFormText
          rules={[{ required: true }]}
          width="md"
          label={intl.formatMessage({ id: 'email' })}
          name="email"
        />
        <ProFormText
          width="md"
          label={intl.formatMessage({ id: 'inviteCode' })}
          name="inviteCode"
        />
        <ProFormText
          rules={[{ required: newRecord }]}
          width="md"
          label={intl.formatMessage({ id: 'password' })}
          name="password"
        />

        {/* 点击编辑不显示*/}
        {newRecord && (
          <ProFormCheckbox.Group
            name="roles"
            layout="horizontal"
            label={intl.formatMessage({ id: 'role_choose' })}
            options={filteredRoles?.map((role: { name: string; _id: string }) => ({
              label: role.name,
              value: role._id,
            }))}
            fieldProps={{
              disabled: loading, // 确保在 loading 时禁用复选框
            }}
          />
        )}
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
