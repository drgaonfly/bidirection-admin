import { useIntl } from '@umijs/max';

const PackageUsageTypeEnum = () => {
  const intl = useIntl();

  return {
    PackageOrder: { text: intl.formatMessage({ id: 'packageOrder' }) }, // 套餐订单
    Rental: { text: intl.formatMessage({ id: 'rental' }) },
  };
};

export default PackageUsageTypeEnum;
