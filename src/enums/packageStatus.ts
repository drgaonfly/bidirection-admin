import { useIntl } from '@umijs/max';

const PackageEnum = () => {
  const intl = useIntl();

  return {
    hourly: { text: intl.formatMessage({ id: 'hourly' }), package: 'hourly' },
    daily: { text: intl.formatMessage({ id: 'daily' }), package: 'daily' },
  };
};

export default PackageEnum;
