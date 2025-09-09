import { useIntl } from '@umijs/max';

const RentalSweepEnum = () => {
  const intl = useIntl();

  return {
    pending: { text: intl.formatMessage({ id: 'pending' }), status: 'default' },
    success: { text: intl.formatMessage({ id: 'success' }), status: 'success' },
    failed: { text: intl.formatMessage({ id: 'failed' }), status: 'error' },
  };
};

export default RentalSweepEnum;
