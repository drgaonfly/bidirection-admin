import { useIntl } from '@umijs/max';

const UnrentalStatusEnum = () => {
  const intl = useIntl();

  return {
    success: { text: intl.formatMessage({ id: 'success' }), status: 'success' },
    failed: { text: intl.formatMessage({ id: 'failed' }), status: 'error' },
  };
};

export default UnrentalStatusEnum;
