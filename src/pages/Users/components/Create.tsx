import { Modal } from 'antd';
import BasicForm from './BasicForm';

interface Props {
  open: boolean;
  onOpenChange: (visible: boolean) => void;
  onFinish: (formData: any) => Promise<void>;
}

const Create: React.FC<Props> = (props) => {
  const { open, onOpenChange, onFinish } = props;
  return (
    <Modal
      title="新增"
      width="45%"
      open={open}
      onCancel={() => onOpenChange(false)}
      destroyOnClose={true}
      maskClosable={false}
      footer={null}
    >
      <BasicForm newRecord onFinish={onFinish} />
    </Modal>
  );
};

export default Create;
