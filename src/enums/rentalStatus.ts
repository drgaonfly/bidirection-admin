import { useIntl } from '@umijs/max';

const RntalStatusEnum = () => {
  const intl = useIntl();

  return {
    pending: { text: intl.formatMessage({ id: 'pending' }), status: 'default' },
    completed: { text: intl.formatMessage({ id: 'completed' }), status: 'success' },
    cancelled: { text: intl.formatMessage({ id: 'cancelled' }), status: 'warning' },
    expired: { text: intl.formatMessage({ id: 'expired' }), status: 'warning' },
    failed: { text: intl.formatMessage({ id: 'failed' }), status: 'error' },
    recycled: { text: intl.formatMessage({ id: 'recycled' }), status: 'processing' },
  };
};

export default RntalStatusEnum;
