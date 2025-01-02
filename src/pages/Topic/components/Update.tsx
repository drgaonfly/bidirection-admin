import { useIntl } from '@umijs/max';
import React, { useEffect, useState } from 'react';
import BasicForm from './BasicForm';
import { Modal } from 'antd';

export type FormValueType = Partial<API.ItemData>;

export type UpdateFormProps = {
  onCancel: (visible: boolean) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalOpen: boolean;
  values: {
    video1?: string;
    video2?: string;
    video?: string;
  } & Partial<API.ItemData>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const intl = useIntl();
  const { updateModalOpen, onCancel, onSubmit, values } = props;

  const [video1, setvideo1] = useState<string | undefined>('');
  const [video2, setvideo2] = useState<string | undefined>('');

  useEffect(() => {
    setvideo1(values.video1);
  }, [values]);

  useEffect(() => {
    setvideo2(values.video2);
  }, [values]);

  return (
    <Modal
      maskClosable={false}
      width="50%"
      destroyOnClose
      title={intl.formatMessage({ id: 'modify' })}
      open={updateModalOpen}
      footer={false}
      onCancel={() => onCancel(false)}
    >
      <BasicForm
        values={values}
        onFinish={onSubmit}
        setvideo1={setvideo1}
        setvideo2={setvideo2}
        video1={video1}
        video2={video2}
      />
    </Modal>
  );
};

export default UpdateForm;
