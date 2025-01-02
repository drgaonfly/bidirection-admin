import React, { useState } from 'react';
import { EditableProTable, ModalForm } from '@ant-design/pro-components';
import { Form, Input } from 'antd';
import { FormattedMessage, useIntl } from '@umijs/max';

type menuItem = {
  _id: string;
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
  const { updateModalOpen, onCancel, onSubmit, values } = props;
  const [menus, setmenu] = useState<menuItem[]>(values?.menus || []);
  console.log('values', values);
  const columns = [
    {
      title: intl.formatMessage({ id: 'correctAnswers' }),
      hideInSearch: false,
      width: 200,
    },
    {
      title: intl.formatMessage({ id: 'count' }),
      dataIndex: 'count',
      hideInSearch: false,
      copyable: true,
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      valueType: 'option',
      width: 200,
      render: (text: any, record: any, _: any, action: any) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(`${record._id}`);
          }}
        >
          {intl.formatMessage({ id: 'edit' })}
        </a>,
      ],
    },
  ];
  return (
    <ModalForm
      title={intl.formatMessage({ id: 'configure', defaultMessage: 'Configure' })}
      width="60%"
      modalProps={{
        destroyOnClose: true,
        maskClosable: false,
      }}
      open={updateModalOpen}
      onOpenChange={onCancel}
      onFinish={async (values: any) => {
        await onSubmit({
          ...values,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          menus: menus.map(({ _id, ...rest }) => rest),
        });
      }}
      initialValues={{ ...values }}
    >
      <>
        <EditableProTable<menuItem>
          rowKey="_id"
          headerTitle={intl.formatMessage({ id: 'correctAnswers' })}
          // @ts-ignore
          columns={columns}
          value={menus}
          name="menus"
          onChange={(value: readonly menuItem[]) => setmenu([...value])}
          editable={{
            type: 'multiple',
          }}
          recordCreatorProps={{
            newRecordType: 'dataSource',
            position: 'bottom',
            record: () => ({
              _id: Date.now().toString(),
              months: 0,
              price: 0,
              originalPrice: 0,
              isOnline: false,
              isCarSeat: false,
              isExclusive: false,
              exclusivePrice: 0,
              exclusiveOriginalPrice: 0,
              seatCount: 0,
              user: values.user,
              token: values.token,
              name: values.name,
              userName: values.userName,
            }),
          }}
        />

        <Form.Item name="_id" label={false}>
          <Input type="hidden" />
        </Form.Item>
      </>
    </ModalForm>
  );
};

export default ConfigureForm;
