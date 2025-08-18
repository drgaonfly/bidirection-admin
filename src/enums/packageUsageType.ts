import { useIntl } from '@umijs/max';

const PackageUsageTypeEnum = () => {
  const intl = useIntl();

  return {
    myself: { text: intl.formatMessage({ id: 'myself' }) },
    other: { text: intl.formatMessage({ id: 'other' }) },
  };
};

export default PackageUsageTypeEnum;
