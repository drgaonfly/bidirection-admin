import { useIntl } from '@umijs/max';

const StatusEnum = () => {
  const intl = useIntl();

  return {
    pending: { text: intl.formatMessage({ id: 'pending' }), status: 'default' },
    completed: { text: intl.formatMessage({ id: 'completed' }), status: 'success' },
    rejected: { text: intl.formatMessage({ id: 'rejected' }), status: 'error' },
  };
};

export default StatusEnum;
