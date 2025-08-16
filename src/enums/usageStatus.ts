import { useIntl } from '@umijs/max';

const UsageStatusEnum = () => {
  const intl = useIntl();

  return {
    success: {
      text: intl.formatMessage({ id: 'success' }),
      status: 'success',
    },
    failed: {
      text: intl.formatMessage({ id: 'failed' }),
      status: 'error',
    },
    pending: {
      text: intl.formatMessage({ id: 'pending' }),
      status: 'warning',
    },
  };
};

export default UsageStatusEnum;
