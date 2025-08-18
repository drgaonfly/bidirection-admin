import { useIntl } from '@umijs/max';

const PackageOrderStatusEnum = () => {
  const intl = useIntl();

  return {
    using: { text: intl.formatMessage({ id: 'using' }), status: 'success' },
    expired: { text: intl.formatMessage({ id: 'expired' }), status: 'error' },
  };
};

export default PackageOrderStatusEnum;
