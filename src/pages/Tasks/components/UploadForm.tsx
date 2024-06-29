import React, { useEffect, useRef, useState } from 'react';
import { ProFormInstance, StepsForm } from '@ant-design/pro-components';
import { Form, Input, Modal, message } from 'antd';
import AliyunOSSUpload from '@/components/AliyunOSSUpload';
import { FormattedMessage, useIntl } from '@umijs/max';

export type FormValueType = Partial<API.ItemData>;

export type UpdateFormProps = {
  open: boolean;
  onOpenChange: (visible: boolean) => void;
  onFinish: (formData: any) => Promise<void>;
  values: any;
};

const UploadForm: React.FC<UpdateFormProps> = (props) => {
  const intl = useIntl();
  const formRef = useRef<ProFormInstance>();
  const { open, onOpenChange, onFinish, values } = props;
  const [current, setCurrent] = useState<number>(0);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [file, setFile] = useState<string>('');
  console.log(file);
  console.log(values);

  const [accountFeedback, setAccountFeedback] = useState('');

  useEffect(() => {
    const requestedAccounts = formRef.current?.getFieldsValue().numberOfAccounts;
    if (accounts.length !== Number(requestedAccounts)) {
      setAccountFeedback(
        intl.formatMessage(
          { id: 'requested_accounts_not_found' },
          { requestedAccounts, accountsLength: accounts.length },
        ),
      );
    } else {
      setAccountFeedback(
        intl.formatMessage({ id: 'requested_accounts_found' }, { requestedAccounts }),
      );
    }
  }, [accounts, formRef]);
  return (
    <StepsForm
      current={current}
      stepsProps={{
        size: 'small',
      }}
      onFormFinish={async (formName, info) => {
        console.log(formName);
        console.log(info);
        if (formName === '0') {
          const hide = message.loading(<FormattedMessage id="adding" defaultMessage="Adding..." />);

          try {
            hide();
          } catch (error: any) {
            console.log(error);
            setAccounts([]);
            hide();
            message.error(error?.response?.data?.message || 'Adding failed, please try again!');
            return false;
          }
        }
      }}
      onCurrentChange={(current: number) => {
        setCurrent(current);
      }}
      stepsFormRender={(dom, submitter) => {
        return (
          <Modal
            width="50%"
            bodyStyle={{ padding: '32px 40px 48px' }}
            destroyOnClose
            title={intl.formatMessage({ id: 'upload_bill', defaultMessage: 'Upload Bill' })}
            open={open}
            footer={submitter}
            onCancel={() => {
              onOpenChange(false);
            }}
          >
            {dom}
          </Modal>
        );
      }}
      // @ts-ignore
      onFinish={(values) => {
        if (accounts.length < 1) {
          message.error(intl.formatMessage({ id: 'no_account_library' }));
          return false;
        }

        if (accounts.length !== formRef.current?.getFieldsValue().numberOfAccounts) {
          Modal.confirm({
            title: intl.formatMessage({ id: 'confirm_submit' }),
            content: intl.formatMessage({ id: 'insufficient_account_library' }),
            onOk() {
              setCurrent(0);
              onOpenChange(false);

              return onFinish({
                ...values,
                accountLibraries: accounts,
              });
            },
            onCancel() {
              // do nothing
            },
          });
          return;
        }

        setCurrent(0);
        onOpenChange(false);

        return onFinish({
          ...values,
          accountLibraries: accounts,
        });
      }}
    >
      <StepsForm.StepForm
        formRef={formRef}
        initialValues={{}}
        title={intl.formatMessage({ id: 'upload_bill_file' })}
      >
        <Form.Item
          required
          label={intl.formatMessage({ id: 'bill_file', defaultMessage: 'Bill File' })}
          name="billFile"
        >
          <div style={{ marginBottom: '30px' }}>
            <a href="https://backend.maomaozhaocai.com/api/static/BillTemplate.xlsx" download>
              {intl.formatMessage({ id: 'download_template', defaultMessage: 'Download Template' })}
            </a>
          </div>
          <AliyunOSSUpload
            onFileUpload={(url: string) => {
              console.log('Uploaded file URL:', url);
              setFile!(url);
            }}
            accept=".xls,.xlsx"
          />
        </Form.Item>
        <Form.Item name="_id" label={false}>
          <Input type="hidden" />
        </Form.Item>
      </StepsForm.StepForm>
      <StepsForm.StepForm
        initialValues={{
          target: '0',
          template: '0',
        }}
        title={intl.formatMessage({ id: 'confirm_bill_content' })}
      >
        {accountFeedback && (
          <div
            style={{
              color:
                accounts.length === formRef.current?.getFieldsValue().numberOfAccounts
                  ? 'green'
                  : 'red',
              marginBottom: '10px',
            }}
          >
            {accountFeedback}
          </div>
        )}
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default UploadForm;
