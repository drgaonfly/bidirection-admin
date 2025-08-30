import { FormattedMessage, useIntl, useAccess } from '@umijs/max';
import React, { useState, useEffect } from 'react';
import {
  ProForm,
  ProFormText,
  ProFormCheckbox,
  ProColumns,
  EditableProTable,
} from '@ant-design/pro-components';
import ProxySelect from './ProxySelect';
import { Form, Input, Spin } from 'antd';
import useQueryList from '@/hooks/useQueryList';
import { getSuperAdminEnergyPerTimes } from '@/services/ant-design-pro/api';

interface Props {
  newRecord?: boolean;
  onFinish: (formData: any) => Promise<void>;
  values?: any;
}

type pricePairItem = {
  _id: string;
  name?: string;
  type: string; // 'hourly' | 'daily'
  commission: number;
  expiration: number;
  times?: number;
};

const BasicForm: React.FC<Props> = ({ newRecord, onFinish, values }) => {
  const intl = useIntl();
  const access = useAccess();
  const { items: roles, loading } = useQueryList('/roles/filter/?type=proxy');
  const [hourlyPricePairs, setHourlyPricePairs] = useState<pricePairItem[]>(
    values?.price_pairs?.filter((item: pricePairItem) => item.type === 'hourly') || [],
  );
  const [dailyPricePairs, setDailyPricePairs] = useState<pricePairItem[]>(
    values?.price_pairs?.filter((item: pricePairItem) => item.type === 'daily') || [],
  );

  const filteredRolesIds = roles?.map((role: { _id: string }) => role._id);

  const [form] = Form.useForm();
  //表单初始化filteredRoles数据更新时，确保表单中的角色选择能加载出来
  useEffect(() => {
    if (roles) {
      form.setFieldsValue({
        roles: filteredRolesIds,
      });
    }
    setHourlyPricePairs(
      values?.price_pairs?.filter((item: pricePairItem) => item.type === 'hourly') || [],
    );
    setDailyPricePairs(
      values?.price_pairs?.filter((item: pricePairItem) => item.type === 'daily') || [],
    );
  }, [roles, values]);

  const [energyPerTimes, setEnergyPerTimes] = useState(0);

  useEffect(() => {
    const fetchEnergyPerTimes = async () => {
      try {
        const { data, success } = await getSuperAdminEnergyPerTimes();

        if (success) {
          console.log('energy_per_times', data.energy_per_times);
          setEnergyPerTimes(data.energy_per_times);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchEnergyPerTimes();
  }, [roles, values]);

  const hourly_columns: ProColumns<pricePairItem>[] = [
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
      valueType: 'digit',
      editable: false,
      render: (_, record) => {
        const times = Number(record.times) || 0;
        return energyPerTimes * times;
      },
    },
    {
      title: intl.formatMessage({ id: 'expiration', defaultMessage: '有效期(小时)' }),
      dataIndex: 'expiration',
      valueType: 'digit',
    },
    {
      title: intl.formatMessage({ id: 'times', defaultMessage: '笔数' }),
      dataIndex: 'times',
      valueType: 'digit',
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

  const daily_columns: ProColumns<pricePairItem>[] = [
    {
      title: intl.formatMessage({ id: 'name', defaultMessage: '名称' }),
      dataIndex: 'name',
      formItemProps: {
        rules: [
          {
            required: true,
            message: intl.formatMessage({ id: 'name_required', defaultMessage: '请输入名称' }),
          },
        ],
      },
    },
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
      valueType: 'digit',
      editable: false,
      render: (_, record) => {
        const times = Number(record.times) || 0;
        return energyPerTimes * times;
      },
    },
    {
      title: intl.formatMessage({ id: 'expiration', defaultMessage: '有效期(小时)' }),
      dataIndex: 'expiration',
      valueType: 'digit',
    },
    {
      title: intl.formatMessage({ id: 'times', defaultMessage: '笔数' }),
      dataIndex: 'times',
      valueType: 'digit',
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
        proxy: values?.proxy?._id,
      }}
      onFinish={async (values) => {
        const combinedPricePairs = [
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ...hourlyPricePairs.map(({ _id, ...rest }) => rest),
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ...dailyPricePairs.map(({ _id, ...rest }) => rest),
        ];
        await onFinish({
          ...values,
          roles: filteredRolesIds,
          price_pairs: combinedPricePairs,
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

        <ProxySelect currentUser={values} />

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
        headerTitle="日租配置"
        columns={daily_columns}
        value={dailyPricePairs}
        onChange={(value) => setDailyPricePairs([...value])}
        editable={{
          type: 'multiple',
          actionRender: (row, config, defaultDoms) => {
            return [defaultDoms.save, defaultDoms.cancel];
          },
        }}
        recordCreatorProps={
          access.canSuperAdmin
            ? {
                newRecordType: 'dataSource',
                position: 'bottom',
                record: () => ({
                  _id: Date.now().toString(),
                  name: '',
                  expenditure: 0,
                  expiration: 0,
                  times: 0,
                  type: 'daily',
                  commission: 0,
                }),
              }
            : false
        }
      />

      <EditableProTable<pricePairItem>
        rowKey="_id"
        headerTitle="闪租配置"
        columns={hourly_columns}
        value={hourlyPricePairs}
        onChange={(value) => setHourlyPricePairs([...value])}
        editable={{
          type: 'multiple',
          actionRender: (row, config, defaultDoms) => {
            return [defaultDoms.save, defaultDoms.cancel];
          },
        }}
        recordCreatorProps={
          access.canSuperAdmin
            ? {
                newRecordType: 'dataSource',
                position: 'bottom',
                record: () => ({
                  _id: Date.now().toString(),
                  expenditure: 0,
                  expiration: 0,
                  times: 0,
                  type: 'hourly',
                  commission: 0,
                }),
              }
            : false
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
