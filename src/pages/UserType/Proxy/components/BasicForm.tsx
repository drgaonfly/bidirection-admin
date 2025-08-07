import { FormattedMessage, useIntl } from '@umijs/max';
import React, { useState } from 'react';
import {
  ProForm,
  ProFormText,
  ProFormCheckbox,
  ProColumns,
  EditableProTable,
} from '@ant-design/pro-components';
import { Form, Input, Spin } from 'antd';
import useQueryList from '@/hooks/useQueryList';

interface Props {
  newRecord?: boolean;
  onFinish: (formData: any) => Promise<void>;
  values?: any;
}

type pricePairItem = {
  _id: string;
  commission: number;
  aqusition: number;
  expiration: number;
};

const BasicForm: React.FC<Props> = ({ newRecord, onFinish, values }) => {
  const intl = useIntl();

  const { items: roles, loading } = useQueryList('/roles/filter/?type=proxy');
  const [pricePairs, setPricePairs] = useState<pricePairItem[]>(values?.price_pairs || []);

  const filteredRolesIds = roles?.map((role: { _id: string }) => role._id);

  const [form] = Form.useForm();
  //表单初始化filteredRoles数据更新时，确保表单中的角色选择能加载出来
  React.useEffect(() => {
    if (roles) {
      form.setFieldsValue({
        roles: filteredRolesIds,
      });
    }
  }, [roles]);

  const pricePair_columns: ProColumns<pricePairItem>[] = [
    {
      title: intl.formatMessage({ id: 'commission', defaultMessage: '分佣(trx)' }),
      dataIndex: 'commission',
      valueType: 'digit',
      formItemProps: {
        rules: [{ required: true, message: intl.formatMessage({ id: 'command_required' }) }],
      },
    },
    {
      title: intl.formatMessage({ id: 'aqusition', defaultMessage: '能量(sun)' }),
      dataIndex: 'aqusition',
      fieldProps: {
        disabled: true,
      },
    },
    {
      title: intl.formatMessage({ id: 'expiration', defaultMessage: '有效期(小时)' }),
      dataIndex: 'expiration',
      valueType: 'digit',
      fieldProps: {
        disabled: true,
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
      valueType: 'option',
      render: (text, record, _, action) => [
        <a key="editable" onClick={() => action?.startEditable?.(`${record._id}`)}>
          {intl.formatMessage({ id: 'edit' })}
        </a>,
      ],
    },
  ];

  return (
    <ProForm
      form={form}
      initialValues={{
        ...values,
        pricePairs: values?.pricePairs?.map((item: any) => item._id),
      }}
      onFinish={async (values) => {
        await onFinish({
          ...values,
          roles: filteredRolesIds,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          price_pairs: pricePairs.map(({ _id, ...rest }) => rest),
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
      loading={loading}
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
          rules={[{ required: newRecord }]}
          width="md"
          label={intl.formatMessage({ id: 'password' })}
          name="password"
        />
        {newRecord &&
          (loading ? (
            <Spin spinning={loading} />
          ) : (
            <ProFormCheckbox.Group
              name="roles"
              layout="horizontal"
              label={intl.formatMessage({ id: 'role_choose' })}
              options={roles?.map((role: { name: string; _id: string }) => ({
                label: role.name,
                value: role._id,
              }))}
              fieldProps={{
                disabled: true, // 确保在 loading 时禁用复选框
              }}
              initialValue={filteredRolesIds}
            />
          ))}
      </ProForm.Group>

      <EditableProTable<pricePairItem>
        rowKey="_id"
        headerTitle="闪兑配置"
        columns={pricePair_columns}
        value={pricePairs}
        onChange={(value) => setPricePairs([...value])}
        editable={{
          type: 'multiple',
          actionRender: (row, config, defaultDoms) => {
            return [defaultDoms.save, defaultDoms.cancel]; // 只保留编辑按钮
          },
        }}
        recordCreatorProps={
          pricePairs.length >= 2
            ? false // 不显示“新增”按钮
            : {
                newRecordType: 'dataSource',
                position: 'bottom',
                record: () => ({
                  _id: Date.now().toString(),
                  commission: 0,
                  aqusition: 0,
                  expiration: 0,
                }),
              }
        }
      />

      {!newRecord && (
        <Form.Item name="_id" label={false}>
          <Input type="hidden" />
        </Form.Item>
      )}
    </ProForm>
  );
};

export default BasicForm;
