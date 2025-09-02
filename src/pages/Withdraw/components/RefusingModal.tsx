import { useIntl } from '@umijs/max';
import { Modal, Form } from 'antd';
import { ProForm, ProFormTextArea } from '@ant-design/pro-components';

interface Props {
  open: boolean;
  onOpenChange: (visible: boolean) => void;
  onFinish: (formData: any) => Promise<void>;
}

const RefusingModal: React.FC<Props> = (props) => {
  const intl = useIntl();
  const { open, onOpenChange, onFinish } = props;
  const [form] = Form.useForm();

  return (
    <Modal
      title={intl.formatMessage({ id: 'refuse_withdraw' })}
      width="500px"
      open={open}
      onCancel={() => onOpenChange(false)}
      destroyOnClose={true}
      maskClosable={false}
      footer={null}
    >
      <ProForm
        form={form}
        onFinish={async (values) => {
          await onFinish(values);
          form.resetFields();
        }}
      >
        <ProFormTextArea
          name="remark"
          label={intl.formatMessage({ id: 'remark', defaultMessage: '拒绝原因' })}
          placeholder={intl.formatMessage({
            id: 'please_input_remark',
            defaultMessage: '请输入拒绝原因',
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'remark_required',
                defaultMessage: '请输入拒绝原因',
              }),
            },
          ]}
        />
      </ProForm>
    </Modal>
  );
};

export default RefusingModal;
