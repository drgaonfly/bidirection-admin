import { useIntl } from '@umijs/max';

const PackageOrderStatusEnum = () => {
  const intl = useIntl();

  return {
    pending: { text: intl.formatMessage({ id: 'pending' }), status: 'normal' },
    using: { text: intl.formatMessage({ id: 'using' }), status: 'success' },
    expired: { text: intl.formatMessage({ id: 'expired' }), status: 'error' },
  };
};

export default PackageOrderStatusEnum;
