import { useIntl } from '@umijs/max';
import { Modal } from 'antd';
import BasicForm from './BasicForm';

interface Props {
  open: boolean;
  onOpenChange: (visible: boolean) => void;
  onFinish: (formData: any) => Promise<void>;
  balanceData?: {
    usdt_balance: number;
    trx_balance: number;
  };
}

const Create: React.FC<Props> = (props) => {
  const intl = useIntl();
  const { open, onOpenChange, onFinish, balanceData } = props;

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
      <BasicForm newRecord onFinish={onFinish} balanceData={balanceData} />
    </Modal>
  );
};

export default Create;
