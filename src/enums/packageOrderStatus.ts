import { useIntl } from '@umijs/max';

const PackageOrderStatusEnum = () => {
  const intl = useIntl();

  return {
    pending: { text: intl.formatMessage({ id: 'packageOrder.status.pending' }), status: 'warning' },
    active: { text: intl.formatMessage({ id: 'packageOrder.status.active' }), status: 'success' },
    expired: { text: intl.formatMessage({ id: 'packageOrder.status.expired' }), status: 'error' },
  };
};

export default PackageOrderStatusEnum;
