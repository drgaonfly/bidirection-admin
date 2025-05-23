import { useIntl } from '@umijs/max';

const StatusEnum = () => {
  const intl = useIntl();

  return {
    pending: { text: intl.formatMessage({ id: 'pending' }), status: 'default' },
    paid: { text: intl.formatMessage({ id: 'paid' }), status: 'success' },
    expired: { text: intl.formatMessage({ id: 'expired' }), status: 'error' },
    canceled: { text: intl.formatMessage({ id: 'canceled' }), status: 'default' },
  };
};

export default StatusEnum;
