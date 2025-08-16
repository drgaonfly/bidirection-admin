import { useIntl } from '@umijs/max';

const PaymentTypeEnum = () => {
  const intl = useIntl();

  return {
    trx: { text: intl.formatMessage({ id: 'packageOrder.paymentType.trx' }), status: 'processing' },
    usdt: { text: intl.formatMessage({ id: 'packageOrder.paymentType.usdt' }), status: 'default' },
  };
};

export default PaymentTypeEnum;
