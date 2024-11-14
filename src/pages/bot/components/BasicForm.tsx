import { useIntl } from '@umijs/max';
import { ProForm, ProFormText } from '@ant-design/pro-components';

interface Props {
  values?: any;
}

const BasicForm: React.FC<Props> = () => {
  const intl = useIntl();

  return (
    <>
      <ProForm.Group>
        <ProFormText
          name="botId"
          label={intl.formatMessage({ id: 'botId' })}
          width="md"
          placeholder={intl.formatMessage({ id: 'please.enter' })}
        />
        <ProFormText
          name="botToken"
          label={intl.formatMessage({ id: 'botToken' })}
          width="md"
          rules={[{ required: true }]}
          placeholder={intl.formatMessage({ id: 'please.enter' })}
        />
        <ProFormText
          name="botUsername"
          label={intl.formatMessage({ id: 'botUsername' })}
          width="md"
          placeholder={intl.formatMessage({ id: 'please.enter' })}
        />
        <ProFormText
          name="botName"
          label={intl.formatMessage({ id: 'botName' })}
          width="md"
          placeholder={intl.formatMessage({ id: 'please.enter' })}
        />
        <ProFormText
          name="telegramId"
          label={intl.formatMessage({ id: 'telegramId' })}
          width="md"
          placeholder={intl.formatMessage({ id: 'please.enter' })}
        />
        <ProFormText
          name="telegramUsername"
          label={intl.formatMessage({ id: 'telegramUsername' })}
          width="md"
          placeholder={intl.formatMessage({ id: 'please.enter' })}
        />
      </ProForm.Group>
    </>
  );
};

export default BasicForm;
