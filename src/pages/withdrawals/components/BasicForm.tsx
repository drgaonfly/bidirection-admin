import { useIntl } from '@umijs/max';
import { ProForm, ProFormSelect, ProFormText, ProFormDigit } from '@ant-design/pro-components';
import CustomerSelect from '@/components/tearcher';
interface Props {
  values?: any;
}

const BasicForm: React.FC<Props> = () => {
  const intl = useIntl();

  return (
    <>
      <ProForm.Group>
        <CustomerSelect />

        <ProFormDigit
          name="amount"
          label={intl.formatMessage({ id: 'withdrawal.amount' })}
          width="md"
          rules={[{ required: true }]}
          min={0}
          fieldProps={{
            precision: 2, // 小数点精度
            prefix: '$', // 前缀
          }}
          placeholder={intl.formatMessage({ id: 'please.enter' })}
        />

        <ProFormSelect
          name="status"
          label={intl.formatMessage({ id: 'withdrawal.status' })}
          width="md"
          rules={[{ required: true }]}
          initialValue="pending"
          options={[
            {
              label: intl.formatMessage({ id: 'withdrawal.status.pending' }),
              value: 'pending',
            },
            {
              label: intl.formatMessage({ id: 'withdrawal.status.approved' }),
              value: 'approved',
            },
            {
              label: intl.formatMessage({ id: 'withdrawal.status.rejected' }),
              value: 'rejected',
            },
            {
              label: intl.formatMessage({ id: 'withdrawal.status.completed' }),
              value: 'completed',
            },
          ]}
          placeholder={intl.formatMessage({ id: 'please.select' })}
        />

        <ProFormText
          name="bankAccount"
          label={intl.formatMessage({ id: 'withdrawal.bankAccount' })}
          width="md"
          rules={[{ required: true }]}
          placeholder={intl.formatMessage({ id: 'please.enter' })}
        />

        <ProFormText
          name="bankName"
          label={intl.formatMessage({ id: 'withdrawal.bankName' })}
          width="md"
          rules={[{ required: true }]}
          placeholder={intl.formatMessage({ id: 'please.enter' })}
        />

        <ProFormText
          name="accountHolder"
          label={intl.formatMessage({ id: 'withdrawal.accountHolder' })}
          width="md"
          rules={[{ required: true }]}
          placeholder={intl.formatMessage({ id: 'please.enter' })}
        />

        <ProFormText
          name="remarks"
          label={intl.formatMessage({ id: 'withdrawal.remarks' })}
          width="md"
          placeholder={intl.formatMessage({ id: 'please.enter' })}
        />
      </ProForm.Group>
    </>
  );
};

export default BasicForm;
