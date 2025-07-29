import { message, Form } from 'antd';
import { FormattedMessage, useIntl } from '@umijs/max';
import { useEffect } from 'react';
import { updateItem } from '@/services/ant-design-pro/api';
import { ModalForm, ProFormTextArea } from '@ant-design/pro-components';

interface RejectApplicationModalProps {
  open: boolean;
  onCancel: (visible: boolean) => void;
  currentRow?: any;
  onFinish?: () => void;
}

const RejectApplicationModal: React.FC<RejectApplicationModalProps> = ({
  open,
  onCancel,
  currentRow,
  onFinish,
}) => {
  const intl = useIntl();
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open, currentRow, form]);

  const handleReject = async (values: any) => {
    const hide = message.loading(<FormattedMessage id="rejecting" defaultMessage="Rejecting..." />);
    try {
      await updateItem(`/bot-users/${currentRow?.botUser._id}/reject-application`, {
        status: 'rejected',
        remark: values.remark,
      });
      hide();
      message.success(
        <FormattedMessage id="reject_successful" defaultMessage="Rejected successfully" />,
      );
      onCancel(false);
      if (onFinish) onFinish();
      return true;
    } catch (error: any) {
      hide();
      message.error(
        error?.response?.data?.message ?? (
          <FormattedMessage id="reject_failed" defaultMessage="Reject failed, please try again" />
        ),
      );
      return false;
    }
  };

  return (
    <ModalForm
      title={intl.formatMessage({ id: 'reject_application', defaultMessage: 'Reject Application' })}
      open={open}
      form={form}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => onCancel(false),
      }}
      onFinish={handleReject}
    >
      <ProFormTextArea
        name="remark"
        label={intl.formatMessage({
          id: 'remark',
          defaultMessage: 'Remark (Reason for rejection)',
        })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'please_input_remark',
              defaultMessage: 'Please input the reason for rejection',
            }),
          },
        ]}
        width="md"
      />
    </ModalForm>
  );
};

export default RejectApplicationModal;
