import { useIntl } from '@umijs/max';
import { ProForm, ProFormText, ProFormDigit, ProFormSwitch } from '@ant-design/pro-components';
import React from 'react';

interface Props {
  newRecord?: boolean;
  values?: any;
}

const BasicForm: React.FC<Props> = ({ newRecord, values }) => {
  const intl = useIntl();
  console.log(newRecord);
  return (
    <>
      <ProForm.Group>
        <ProFormText
          rules={[{ required: true, message: intl.formatMessage({ id: 'enter_store_name' }) }]}
          width="md"
          label={intl.formatMessage({ id: 'store_name' })}
          name="storeName"
          placeholder={intl.formatMessage({ id: 'enter_store_name' })}
        />
        <ProFormText
          rules={[{ required: true, message: intl.formatMessage({ id: 'enter_order_number' }) }]}
          width="md"
          label={intl.formatMessage({ id: 'order_number' })}
          name="orderNumber"
          placeholder={intl.formatMessage({ id: 'enter_order_number' })}
        />
        <ProFormDigit
          label={intl.formatMessage({ id: 'amount' })}
          name="amount"
          width="md"
          min={0}
          rules={[{ required: true, message: intl.formatMessage({ id: 'enter_amount' }) }]}
          placeholder={intl.formatMessage({ id: 'enter_amount' })}
        />
        <ProFormText
          rules={[{ required: true, message: intl.formatMessage({ id: 'enter_buyer_id' }) }]}
          width="md"
          label={intl.formatMessage({ id: 'buyer_id' })}
          name="buyerId"
          placeholder={intl.formatMessage({ id: 'enter_buyer_id' })}
        />
      </ProForm.Group>
      {!newRecord && (
        <ProForm.Group>
          <ProFormSwitch
            name="isSigned"
            label={intl.formatMessage({ id: 'is_signed' })}
            initialValue={values?.isSigned}
          />
          <ProFormSwitch
            name="isReviewed"
            label={intl.formatMessage({ id: 'is_reviewed' })}
            initialValue={values?.isReviewed}
          />
        </ProForm.Group>
      )}
    </>
  );
};

export default BasicForm;
