import { useIntl } from '@umijs/max';
import { Modal } from 'antd';
import BasicForm from './BasicForm';

interface Props {
  open: boolean;
  onOpenChange: (visible: boolean) => void;
  onFinish: (formData: any) => Promise<void>;
  setvideo1: (url: string) => void;
  setvideo2: (url: string) => void;
}

const Create: React.FC<Props> = (props) => {
  const intl = useIntl();
  const { open, onOpenChange, onFinish, setvideo1, setvideo2 } = props;
  return (
    <Modal
      title={intl.formatMessage({ id: 'add_new' })}
      width="45%"
      open={open}
      onCancel={() => onOpenChange(false)}
      destroyOnClose={true}
      maskClosable={false}
      footer={null}
    >
      <BasicForm newRecord setvideo1={setvideo1} setvideo2={setvideo2} onFinish={onFinish} />
    </Modal>
  );
};

export default Create;
