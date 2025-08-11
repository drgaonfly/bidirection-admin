import { useIntl } from '@umijs/max';

const DecutionStatusEnum = () => {
  const intl = useIntl();

  return {
    pending: {
      text: intl.formatMessage({ id: 'pending', defaultMessage: '待处理' }),
      status: 'default',
    },
    processing: {
      text: intl.formatMessage({ id: 'processing', defaultMessage: '处理中' }),
      status: 'processing',
    },
    completed: { text: intl.formatMessage({ id: 'completed' }), status: 'success' },
    failed: { text: intl.formatMessage({ id: 'failed', defaultMessage: '失败' }), status: 'error' },
    cancelled: { text: intl.formatMessage({ id: 'cancelled' }), status: 'default' },
  };
};

export default DecutionStatusEnum;
