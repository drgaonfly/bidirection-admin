import { FormattedMessage } from '@umijs/max';
import React from 'react';
import BasicForm from './BasicForm';
import { Modal } from 'antd';

export type FormValueType = Partial<API.ItemData>;

export type UpdateFormProps = {
  onCancel: (visible: boolean) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalOpen: boolean;
  values: Partial<API.ItemData>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { updateModalOpen, onCancel, onSubmit, values } = props;

  return (
    <Modal
      maskClosable={false}
      width="50%"
      destroyOnClose
      title={<FormattedMessage id="modify" defaultMessage="Modify" />}
      open={updateModalOpen}
      footer={false}
      onCancel={() => onCancel(false)}
    >
      <BasicForm values={values} onFinish={onSubmit} newRecord={false} />
    </Modal>
  );
};

export default UpdateForm;
