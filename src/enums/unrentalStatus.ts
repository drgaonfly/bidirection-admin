import { useIntl } from '@umijs/max';

const UnrentalStatusEnum = () => {
  const intl = useIntl();

  return {
    undelegated: { text: intl.formatMessage({ id: 'undelegated' }), status: 'undelegated' },
    failed: { text: intl.formatMessage({ id: 'failed' }), status: 'error' },
  };
};

export default UnrentalStatusEnum;
