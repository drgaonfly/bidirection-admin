import { useIntl } from '@umijs/max';
import React from 'react';
import { ProForm, ProFormDigit, ProFormSelect } from '@ant-design/pro-components';
import { Form, Input } from 'antd';
import PackageEnum from '../../../../enums/packageStatus';

interface Props {
  newRecord?: boolean;
  onFinish: (formData: any) => Promise<void>;
  values?: any;
}

const BasicForm: React.FC<Props> = ({ newRecord, onFinish, values }) => {
  const intl = useIntl();

  return (
    <ProForm
      initialValues={{
        ...values,
      }}
      onFinish={async (formValues) => {
        await onFinish({
          ...formValues,
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
    >
      <ProForm.Group>
        <ProFormDigit
          name="expenditure"
          width="md"
          label={intl.formatMessage({ id: 'expenditure', defaultMessage: 'Expenditure (TRX)' })}
          min={0}
          required
        />

        <ProFormDigit
          name="commission"
          width="md"
          label={intl.formatMessage({ id: 'commission', defaultMessage: 'Commission' })}
          min={0}
          required
        />

        <ProFormSelect
          name="type"
          width="md"
          label={intl.formatMessage({ id: 'type', defaultMessage: 'Type' })}
          valueEnum={PackageEnum}
          required
        />
      </ProForm.Group>

      <ProForm.Group>
        <ProFormDigit
          name="min_expenditure"
          width="md"
          label={intl.formatMessage({ id: 'min_expenditure', defaultMessage: 'min_expenditure' })}
          min={0}
          required
        />

        <ProFormDigit
          name="expiration"
          width="md"
          label={intl.formatMessage({ id: 'expiration', defaultMessage: 'Expiration (Hour)' })}
          min={0}
          required
        />

        <ProFormDigit
          name="times"
          width="md"
          label={intl.formatMessage({ id: 'times', defaultMessage: 'Times' })}
          min={0}
          required
        />
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
