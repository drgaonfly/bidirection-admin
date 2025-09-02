import { useIntl, useModel } from '@umijs/max';
import React, { useState, useEffect } from 'react';
import { ProForm, ProFormText, ProFormCheckbox } from '@ant-design/pro-components';
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
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
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

  useEffect(() => {
    const fetchEnergyPerTimes = async () => {
      try {
        const { data, success } = await getSuperAdminEnergyPerTimes();

        if (success) {
          console.log('energy_per_times', data.energy_per_times);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchEnergyPerTimes();
  }, [roles, values]);

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

        {currentUser?.isAdmin && <ProxySelect currentUser={values} />}

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

      {!newRecord && (
        <Form.Item name="_id" label={false}>
          <Input type="hidden" />
        </Form.Item>
      )}
    </ProForm>
  );
};

export default BasicForm;
