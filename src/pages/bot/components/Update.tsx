import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';

export type FormValueType = {
  _id?: string;
  botId?: string;
  botToken?: string;
  botUsername?: string;
  botName?: string;
  telegramId?: string;
  telegramUsername?: string;
  description?: string;
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
      modalProps={{
        onCancel: () => onCancel(false),
      }}
      onFinish={async (formValues) => {
        await onSubmit({
          ...values,
          ...formValues,
        });
        return true;
      }}
      initialValues={values}
    >
      <ProFormText
        name="botId"
        label={intl.formatMessage({ id: 'pages.searchTable.form.botId' })}
        placeholder={intl.formatMessage({
          id: 'pages.searchTable.form.placeholder',
        })}
      />
      <ProFormText
        name="botToken"
        label={intl.formatMessage({ id: 'pages.searchTable.form.botToken' })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: 'pages.searchTable.form.required' }),
          },
        ]}
        placeholder={intl.formatMessage({
          id: 'pages.searchTable.form.placeholder',
        })}
      />
      <ProFormText
        name="botUsername"
        label={intl.formatMessage({ id: 'pages.searchTable.form.botUsername' })}
        placeholder={intl.formatMessage({
          id: 'pages.searchTable.form.placeholder',
        })}
      />
      <ProFormText
        name="botName"
        label={intl.formatMessage({ id: 'pages.searchTable.form.botName' })}
        placeholder={intl.formatMessage({
          id: 'pages.searchTable.form.placeholder',
        })}
      />
      <ProFormText
        name="telegramId"
        label={intl.formatMessage({ id: 'pages.searchTable.form.telegramId' })}
        placeholder={intl.formatMessage({
          id: 'pages.searchTable.form.placeholder',
        })}
      />
      <ProFormText
        name="telegramUsername"
        label={intl.formatMessage({ id: 'pages.searchTable.form.telegramUsername' })}
        placeholder={intl.formatMessage({
          id: 'pages.searchTable.form.placeholder',
        })}
      />
      <ProFormTextArea
        name="description"
        label={intl.formatMessage({ id: 'description' })}
        placeholder={intl.formatMessage({ id: 'pages.searchTable.form.placeholder' })}
        fieldProps={{
          autoSize: { minRows: 2, maxRows: 6 },
        }}
      />
    </ModalForm>
  );
};

export default UpdateForm;
