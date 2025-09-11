import { useIntl } from '@umijs/max';

const TgStarStatusEnum = () => {
  const intl = useIntl();

  return {
    pending: { text: intl.formatMessage({ id: 'pending' }), status: 'warning' },
    success: { text: intl.formatMessage({ id: 'success' }), status: 'success' },
    expired: { text: intl.formatMessage({ id: 'expired' }), status: 'error' },
    cancelled: { text: intl.formatMessage({ id: 'cancelled' }), status: 'default' },
    failed: { text: intl.formatMessage({ id: 'failed' }), status: 'error' },
  };
};

export default TgStarStatusEnum;
