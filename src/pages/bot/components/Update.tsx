import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';

export type FormValueType = {
  _id?: string;
  botId?: string;
  botToken?: string;
  botUsername?: string;
  botName?: string;
  telegramId?: string;
  telegramUsername?: string;
};

export type UpdateFormProps = {
  onCancel: (flag?: boolean) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalOpen: boolean;
  values: Partial<FormValueType>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { updateModalOpen, onCancel, onSubmit, values } = props;
  const intl = useIntl();

  return (
    <ModalForm
      title={intl.formatMessage({ id: 'pages.searchTable.updateForm.title' })}
      open={updateModalOpen}
      onFinish={async (formValues) => {
        await onSubmit({ ...values, ...formValues }); // 合并原有值和表单值
      }}
      onOpenChange={onCancel}
      initialValues={values} // 设置初始值
    >
      <ProFormText
        name="botId"
        label={intl.formatMessage({ id: 'botId' })}
        placeholder={intl.formatMessage({ id: 'please.enter' })}
      />
      <ProFormText
        name="botToken"
        label={intl.formatMessage({ id: 'botToken' })}
        placeholder={intl.formatMessage({ id: 'please.enter' })}
        rules={[{ required: true }]}
      />
      <ProFormText
        name="botUsername"
        label={intl.formatMessage({ id: 'botUsername' })}
        placeholder={intl.formatMessage({ id: 'please.enter' })}
      />
      <ProFormText
        name="botName"
        label={intl.formatMessage({ id: 'botName' })}
        placeholder={intl.formatMessage({ id: 'please.enter' })}
      />
      <ProFormText
        name="telegramId"
        label={intl.formatMessage({ id: 'telegramId' })}
        placeholder={intl.formatMessage({ id: 'please.enter' })}
      />
      <ProFormText
        name="telegramUsername"
        label={intl.formatMessage({ id: 'telegramUsername' })}
        placeholder={intl.formatMessage({ id: 'please.enter' })}
      />
    </ModalForm>
  );
};

export default UpdateForm;
