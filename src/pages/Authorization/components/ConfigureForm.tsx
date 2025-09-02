import React, { useState, useEffect } from 'react';
import { updateItem } from '@/services/ant-design-pro/api';
import {
  EditableProTable,
  ModalForm,
  ProFormTextArea,
  ProDescriptions,
  ProFormGroup,
  ProFormText,
  ProFormDigit,
  ProFormSwitch,
  // ProFormSelect,
  type ProColumns,
} from '@ant-design/pro-components';
import { Form, Input, message, Button } from 'antd';
import { FormattedMessage, useAccess, useIntl, useModel } from '@umijs/max';
import { getSuperAdminEnergyPerTimes } from '@/services/ant-design-pro/api';

type menuItem = {
  _id: string;
  menuName: string;
  url: string;
};

type keyboardItem = {
  _id: string;
  command: string;
  content: string;
};

type commandItem = {
  _id: string;
  name: string;
  content: string;
  isStart: boolean;
  weight: number;
};

type pricePairItem = {
  _id: string;
  name?: string;
  expenditure: number;
  // aqusition: number;
  expiration: number;
  times: number;
  type: string; // hourly, daily
};

// const handleTronAddress = async (fields: FormValueType) => {
//   const hide = message.loading(<FormattedMessage id="updating" defaultMessage="Updating..." />);
//   try {
//     await updateItem(`/bots/${fields._id}/tron-address`, fields);
//     hide();

//     message.success(<FormattedMessage id="update_successful" defaultMessage="Update successful" />);
//     return true;
//   } catch (error: any) {
//     hide();
//     message.error(
//       error?.response?.data?.message ?? (
//         <FormattedMessage id="update_failed" defaultMessage="Update failed, please try again!" />
//       ),
//     );
//     return false;
//   }
// };

export type FormValueType = Partial<API.ItemData>;

export type UpdateFormProps = {
  onCancel: (visible: boolean) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalOpen: boolean;
  values: {
    menus?: any;
    user?: any;
  } & Partial<API.ItemData>;
};

const ConfigureForm: React.FC<UpdateFormProps> = (props) => {
  const intl = useIntl();
  const access = useAccess();
  const [form] = Form.useForm();
  const { updateModalOpen, onCancel, onSubmit, values } = props;
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  const [menus, setMenus] = useState<menuItem[]>(values?.menus || []);
  const [keyboards, setKeyboards] = useState<keyboardItem[]>(values?.keyboards || []);
  const [commands, setCommands] = useState<commandItem[]>(values?.commands || []);
  const [hourlyPricePairs, setHourlyPricePairs] = useState<pricePairItem[]>(
    values?.price_pairs?.filter((item: pricePairItem) => item.type === 'hourly') || [],
  );
  const [dailyPricePairs, setDailyPricePairs] = useState<pricePairItem[]>(
    values?.price_pairs?.filter((item: pricePairItem) => item.type === 'daily') || [],
  );
  const [generating, setGenerating] = useState(false);
  const [energyPerTimes, setEnergyPerTimes] = useState(0);

  const isAdmin = currentUser?.isAdmin;

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
  }, [currentUser]);

  // 按钮点击函数
  const handleGenerateEnergyAddress = async () => {
    const fields = form.getFieldsValue();
    setGenerating(true);

    try {
      const { data } = await updateItem(`/bots/${fields._id}/tron-address`, fields);

      // 仅更新部分字段
      const newAddress = data?.energy_address;

      console.log('data', data);

      if (newAddress) {
        form.setFieldsValue({
          ...fields,
          energy_address: newAddress, // 👈 更新 energy_address 字段
        });
      }

      message.success('能量地址生成成功');
    } catch (error: any) {
      message.error(error?.response?.data?.message ?? '生成失败，请重试！');
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    if (updateModalOpen && values) {
      form.setFieldsValue({
        ...values,
      });
      setKeyboards(values?.keyboards || []);
      setCommands(values?.commands || []);
      setMenus(values?.menus || []);
      setHourlyPricePairs(
        values?.price_pairs?.filter((item: pricePairItem) => item.type === 'hourly') || [],
      );
      setDailyPricePairs(
        values?.price_pairs?.filter((item: pricePairItem) => item.type === 'daily') || [],
      );
    }
  }, [updateModalOpen, values]);

  const columns: ProColumns<menuItem>[] = [
    {
      title: intl.formatMessage({ id: 'menuName', defaultMessage: '按钮' }),
      dataIndex: 'menuName',
      width: 200,
    },
    {
      title: intl.formatMessage({ id: 'url', defaultMessage: '菜单链接' }),
      dataIndex: 'url',
      copyable: true,
      initialValue: process.env.UMI_APP_MENU_URL,
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
      valueType: 'option',
      width: 200,
      render: (text, record, _, action) => [
        <a key="editable" onClick={() => action?.startEditable?.(`${record._id}`)}>
          {intl.formatMessage({ id: 'edit' })}
        </a>,
      ],
    },
  ];

  const keyboard_columns: ProColumns<keyboardItem>[] = [
    {
      title: intl.formatMessage({ id: 'command', defaultMessage: '命令' }),
      dataIndex: 'command',
      formItemProps: {
        rules: [{ required: true, message: intl.formatMessage({ id: 'command_required' }) }],
      },
    },
    {
      title: intl.formatMessage({ id: 'content', defaultMessage: '内容' }),
      dataIndex: 'content',
      valueType: 'textarea',
      formItemProps: {
        rules: [{ required: true, message: intl.formatMessage({ id: 'content_required' }) }],
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
      valueType: 'option',
      width: 200,
      render: (text, record, _, action) => [
        <a key="editable" onClick={() => action?.startEditable?.(`${record._id}`)}>
          {intl.formatMessage({ id: 'edit' })}
        </a>,
      ],
    },
  ];

  const command_columns: ProColumns<commandItem>[] = [
    {
      title: intl.formatMessage({ id: 'name', defaultMessage: '命令名' }),
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: intl.formatMessage({ id: 'name_required' }) }],
      },
    },
    {
      title: intl.formatMessage({ id: 'content', defaultMessage: '回复内容' }),
      dataIndex: 'content',
      valueType: 'textarea',
      formItemProps: {
        rules: [{ required: true, message: intl.formatMessage({ id: 'content_required' }) }],
      },
    },
    {
      title: intl.formatMessage({ id: 'isStart', defaultMessage: '是否启动' }),
      dataIndex: 'isStart',
      valueType: 'switch',
    },
    {
      title: intl.formatMessage({ id: 'weight', defaultMessage: '权重' }),
      dataIndex: 'weight',
      valueType: 'digit',
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
      valueType: 'option',
      width: 200,
      render: (text, record, _, action) => [
        <a key="editable" onClick={() => action?.startEditable?.(`${record._id}`)}>
          {intl.formatMessage({ id: 'edit' })}
        </a>,
      ],
    },
  ];

  const pricePair_hourly_columns: ProColumns<pricePairItem>[] = [
    {
      title: intl.formatMessage({ id: 'name', defaultMessage: '命令名' }),
      dataIndex: 'name',
      editable: () => !!isAdmin, // 不是管理员就禁止修改
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
      title: intl.formatMessage({ id: 'expenditure_hourly', defaultMessage: '价格(trx)' }),
      dataIndex: 'expenditure',
      valueType: 'digit',
      editable: () => !!isAdmin, // 不是管理员就禁止修改
      formItemProps: {
        rules: [{ required: true, message: intl.formatMessage({ id: 'command_required' }) }],
      },
    },
    {
      title: intl.formatMessage({ id: 'sale', defaultMessage: '出价(trx)' }),
      dataIndex: 'sale',
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
      editable: () => !!isAdmin,
    },
    {
      title: intl.formatMessage({ id: 'times', defaultMessage: '笔数' }),
      dataIndex: 'times',
      valueType: 'digit',
      editable: () => !!isAdmin, // 不是管理员就禁止修改
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
      valueType: 'option',
      width: 200,
      render: (text, record, _, action) => [
        <a key="editable" onClick={() => action?.startEditable?.(`${record._id}`)}>
          {intl.formatMessage({ id: 'edit' })}
        </a>,
      ],
    },
  ];

  const pricePair_daily_columns: ProColumns<pricePairItem>[] = [
    {
      title: intl.formatMessage({ id: 'name', defaultMessage: '名称' }),
      dataIndex: 'name',
      editable: () => !!isAdmin, // 不是管理员就禁止修改
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
      title: intl.formatMessage({ id: 'expenditure_daily', defaultMessage: '来价(usdt)' }),
      dataIndex: 'expenditure',
      valueType: 'digit',
      editable: () => !!isAdmin, // 不是管理员就禁止修改
      formItemProps: {
        rules: [{ required: true, message: intl.formatMessage({ id: 'command_required' }) }],
      },
    },
    {
      title: intl.formatMessage({ id: 'sale', defaultMessage: '出价(usdt)' }),
      dataIndex: 'sale',
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
      editable: () => !!isAdmin, // 不是管理员就禁止修改
    },
    {
      title: intl.formatMessage({ id: 'times', defaultMessage: '笔数' }),
      dataIndex: 'times',
      valueType: 'digit',
      editable: () => !!isAdmin, // 不是管理员就禁止修改
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
      valueType: 'option',
      width: 200,
      render: (text, record, _, action) => [
        <a key="editable" onClick={() => action?.startEditable?.(`${record._id}`)}>
          {intl.formatMessage({ id: 'edit' })}
        </a>,
      ],
    },
  ];

  return (
    <ModalForm
      form={form}
      title={intl.formatMessage({ id: 'configure', defaultMessage: '配置' })}
      width="60%"
      modalProps={{ destroyOnClose: true, maskClosable: false }}
      open={updateModalOpen}
      onOpenChange={onCancel}
      onFinish={async (values) => {
        const formValues = form.getFieldsValue();
        const combinedPricePairs = [
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ...hourlyPricePairs.map(({ _id, ...rest }) => rest),
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ...dailyPricePairs.map(({ _id, ...rest }) => rest),
        ];

        await onSubmit({
          ...values,
          ...formValues,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          keyboards: keyboards.map(({ _id, ...rest }) => rest),
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          menus: menus.map(({ _id, ...rest }) => rest),
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          commands: commands.map(({ _id, ...rest }) => rest),
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          price_pairs: combinedPricePairs,
        });
      }}
      initialValues={{
        ...values,
        commands: values?.commands?.map((item: any) => item._id),
        keyboards: values?.keyboards?.map((item: any) => item._id),
        menus: values?.menus?.map((item: any) => item._id),
        pricePairs: values?.pricePairs?.map((item: any) => item._id),
      }}
    >
      {values && (
        <ProDescriptions<API.ItemData>
          column={2}
          title={intl.formatMessage({ id: 'userDetails', defaultMessage: '用户详情' })}
          request={async () => ({
            data: {
              ...values,
              inviteCode: (currentUser as any)?.inviteCode || '',
            },
          })}
          columns={[
            {
              title: intl.formatMessage({ id: 'token', defaultMessage: 'token' }),
              dataIndex: 'token',
              copyable: true,
            },
            {
              title: intl.formatMessage({ id: 'botName', defaultMessage: '机器人名称' }),
              dataIndex: 'botName',
              copyable: true,
            },
          ]}
          bordered
          labelStyle={{
            width: '10%',
            justifyContent: 'flex-end',
            padding: '8px 16px',
            backgroundColor: '#f0f0f0',
          }}
          contentStyle={{
            width: '50%',
            padding: '8px 16px',
          }}
          size="small"
          style={{ marginTop: '20px', marginBottom: '10px' }}
        />
      )}

      <ProFormGroup>
        <ProFormTextArea
          name="message"
          label="开始消息"
          width="md"
          fieldProps={{
            autoSize: { minRows: 8 },
          }}
        />

        <ProFormTextArea
          name="contact"
          label="联系客服信息"
          width="md"
          fieldProps={{
            autoSize: { minRows: 8 },
          }}
        />

        <ProFormText
          name="customer_service_link"
          label="客服链接"
          width="md"
          placeholder="https://t.me/"
        />
      </ProFormGroup>

      <ProFormGroup>
        <ProFormText
          name="trx20_address"
          label="trx20 地址"
          width="md"
          placeholder="请输入 trx 地址"
        />
        <ProFormText
          name="auto_exchange_address"
          label="自动兑换地址"
          width="md"
          placeholder="请输入自动兑换地址"
        />
        <ProFormText
          name="energy_address"
          initialValue={values.energy_address}
          label="能量地址"
          width="md"
          placeholder="请输入能量地址"
          rules={[{ required: false, message: '请输入能量地址' }]}
          disabled
          fieldProps={{
            addonAfter: (
              <Button
                type="text"
                size="small"
                loading={generating}
                onClick={async () => {
                  if (values.energy_address) {
                    await navigator.clipboard.writeText(values.energy_address);
                  } else {
                    await handleGenerateEnergyAddress();
                  }
                }}
              >
                {values.energy_address
                  ? intl.formatMessage({ id: 'copy', defaultMessage: '复制' })
                  : intl.formatMessage({ id: 'generate', defaultMessage: '生成' })}
              </Button>
            ),
          }}
        />
      </ProFormGroup>

      <ProFormGroup>
        <ProFormDigit
          name="fee"
          label="闪兑费率"
          width="md"
          placeholder="请输入手续费百分比"
          min={0}
          max={100}
          fieldProps={{ precision: 0, addonAfter: '%' }}
        />
        <ProFormDigit
          name="downStream_fee"
          label="下游闪兑费率"
          width="md"
          placeholder="请输入手续费百分比"
          min={0}
          max={100}
          fieldProps={{ precision: 0, addonAfter: '%' }}
        />
        <ProFormDigit
          name="min_interger_limit"
          label="预支能量的最少几分数"
          width="md"
          placeholder="如: 10"
        />
      </ProFormGroup>

      <ProFormSwitch name="canBeCloned" label="是否可克隆" width="md" />

      <EditableProTable<pricePairItem>
        rowKey="_id"
        headerTitle="日租配置"
        columns={pricePair_daily_columns}
        value={dailyPricePairs}
        onChange={(value) => setDailyPricePairs([...value])}
        editable={{
          type: 'multiple',
          actionRender: (row, config, defaultDoms) => {
            return [defaultDoms.save, defaultDoms.cancel]; // 只保留编辑按钮
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
                  sale: 0,
                }),
              }
            : false
        }
      />

      <EditableProTable<pricePairItem>
        rowKey="_id"
        headerTitle="闪租配置"
        columns={pricePair_hourly_columns}
        value={hourlyPricePairs}
        onChange={(value) => setHourlyPricePairs([...value])}
        editable={{
          type: 'multiple',
          actionRender: (row, config, defaultDoms) => {
            return [defaultDoms.save, defaultDoms.cancel]; // 只保留编辑按钮
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
                  sale: 0,
                }),
              }
            : false
        }
      />

      <EditableProTable<commandItem>
        rowKey="_id"
        headerTitle="命令配置"
        columns={command_columns}
        value={commands}
        onChange={(value) => setCommands([...value])}
        editable={{ type: 'multiple' }}
        recordCreatorProps={{
          newRecordType: 'dataSource',
          position: 'bottom',
          record: () => ({
            _id: Date.now().toString(),
            name: '',
            content: '',
            isStart: false,
            weight: 0,
          }),
        }}
      />

      <EditableProTable<keyboardItem>
        rowKey="_id"
        headerTitle="键盘配置"
        columns={keyboard_columns}
        value={keyboards}
        onChange={(value) => setKeyboards([...value])}
        editable={{ type: 'multiple' }}
        recordCreatorProps={{
          newRecordType: 'dataSource',
          position: 'bottom',
          record: () => ({
            _id: Date.now().toString(),
            command: '',
            content: '',
          }),
        }}
      />

      <EditableProTable<menuItem>
        rowKey="_id"
        headerTitle="内联菜单配置"
        columns={columns}
        value={menus}
        onChange={(value) => setMenus([...value])}
        editable={{ type: 'multiple' }}
        recordCreatorProps={{
          newRecordType: 'dataSource',
          position: 'bottom',
          record: () => ({
            _id: Date.now().toString(),
            menuName: '',
            url: '',
          }),
        }}
      />

      <Form.Item name="_id" label={false}>
        <Input type="hidden" />
      </Form.Item>
    </ModalForm>
  );
};

export default ConfigureForm;
