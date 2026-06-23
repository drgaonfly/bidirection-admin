import React, { useState, useEffect } from 'react';
import {
  EditableProTable,
  ModalForm,
  ProFormTextArea,
  ProDescriptions,
  ProFormGroup,
  ProFormText,
  ProFormDigit,
  type ProColumns,
} from '@ant-design/pro-components';
import { Form, Input } from 'antd';
import { FormattedMessage, useAccess, useIntl, useModel } from '@umijs/max';

type menuItem = {
  _id: string;
  menuName: string;
  url: string;
};

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
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  const { updateModalOpen, onCancel, onSubmit, values } = props;
  const [menus, setMenus] = useState<menuItem[]>(values?.menus || []);

  const isAdmin = currentUser?.isAdmin;

  useEffect(() => {
    if (updateModalOpen && values) {
      form.setFieldsValue({
        ...values,
      });
      setMenus(values?.menus || []);
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
        await onSubmit({
          ...values,
          ...formValues,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          menus: menus.map(({ _id, ...rest }) => rest),
        });
      }}
      initialValues={{
        ...values,
        commands: values?.commands?.map((item: any) => item._id),
        keyboards: values?.keyboards?.map((item: any) => item._id),
        menus: values?.menus?.map((item: any) => item._id),
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
      </ProFormGroup>

      <ProFormGroup>
        {access.canUpdateCustomerServiceLink && (
          <ProFormText
            name="customer_service_link"
            label="客服链接"
            width="md"
            placeholder="https://t.me/"
          />
        )}

        {access.canUpdateTrx20Address && (
          <ProFormText
            name="trx20_address"
            label="trx20 地址"
            width="md"
            placeholder="请输入 trx 地址"
          />
        )}

        {access.canUpdateAutoExchangeAddress && (
          <ProFormText
            name="auto_exchange_address"
            label="自动兑换地址"
            width="md"
            placeholder="请输入自动兑换地址"
          />
        )}
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
          disabled={!isAdmin}
        />
      </ProFormGroup>

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
