import React, { useState, useEffect } from 'react';
import { useIntl } from '@umijs/max';
import { Form, Input, message, Select } from 'antd';
import { FormattedMessage } from '@umijs/max';
import { ModalForm } from '@ant-design/pro-components';
import { updateItem } from '@/services/ant-design-pro/api';

interface DeleteOwnerFormProps {
  open: boolean;
  onCancel: (visible: boolean) => void;
  values: any;
  onSuccess: () => void;
}

const DeleteOwnerForm: React.FC<DeleteOwnerFormProps> = (props) => {
  const { open, onCancel, values, onSuccess } = props;
  const intl = useIntl();
  const [form] = Form.useForm();
  const [owners, setOwners] = useState<string[]>([]);

  // 当values变化时，更新owners列表
  useEffect(() => {
    if (values && values.owners && Array.isArray(values.owners)) {
      setOwners(values.owners);
    } else {
      setOwners([]);
    }
  }, [values]);

  const handleDeleteOwner = async (formValues: { owner: string }) => {
    const hide = message.loading(<FormattedMessage id="deleting" defaultMessage="Deleting..." />);
    try {
      // 调用API删除owner
      await updateItem(`/bots/${values._id}/delete-owner`, {
        owner: formValues.owner,
        id: values._id,
      });
      hide();
      message.success(
        <FormattedMessage id="delete_successful" defaultMessage="Deleted successfully" />,
      );
      onSuccess(); // 刷新列表
      return true;
    } catch (error: any) {
      hide();
      message.error(
        error?.response?.data?.message ?? (
          <FormattedMessage id="delete_failed" defaultMessage="Delete failed, please try again!" />
        ),
      );
      return false;
    }
  };

  return (
    <ModalForm
      title={intl.formatMessage({ id: 'delete_owner', defaultMessage: '删除Owner' })}
      width="500px"
      form={form}
      modalProps={{
        destroyOnClose: true,
        maskClosable: false,
      }}
      open={open}
      onOpenChange={onCancel}
      onFinish={async (formValues) => {
        const success = await handleDeleteOwner(formValues as { owner: string });
        if (success) {
          onCancel(false);
          form.resetFields();
        }
        return success;
      }}
    >
      <Form.Item
        name="owner"
        label={intl.formatMessage({ id: 'owner', defaultMessage: 'Owner' })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'select_owner_required',
              defaultMessage: '请选择要删除的Owner',
            }),
          },
        ]}
      >
        <Select
          placeholder={intl.formatMessage({
            id: 'select_owner',
            defaultMessage: '请选择要删除的Owner',
          })}
          options={owners.map((owner) => ({ label: owner, value: owner }))}
          notFoundContent={intl.formatMessage({
            id: 'no_owners',
            defaultMessage: '没有可删除的Owner',
          })}
        />
      </Form.Item>

      <Form.Item name="_id" hidden initialValue={values._id}>
        <Input type="hidden" />
      </Form.Item>
    </ModalForm>
  );
};

export default DeleteOwnerForm;
