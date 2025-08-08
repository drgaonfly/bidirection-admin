import { useIntl } from '@umijs/max';

const RntalStatusEnum = () => {
  const intl = useIntl();

  return {
    pending: { text: intl.formatMessage({ id: 'pending' }), status: 'default' },
    completed: { text: intl.formatMessage({ id: 'completed' }), status: 'completed' },
    expired: { text: intl.formatMessage({ id: 'expired' }), status: 'error' },
    canceled: { text: intl.formatMessage({ id: 'canceled' }), status: 'default' },
  };
};

export default RntalStatusEnum;
