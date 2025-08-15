import { ProDescriptions } from '@ant-design/pro-components';
import type { ProDescriptionsItemProps } from '@ant-design/pro-components';
import { Modal, Tag } from 'antd';
import React from 'react';
import { useIntl } from '@umijs/max';

export type ShowProps = {
  open: boolean;
  currentRow?: API.ItemData;
  columns: ProDescriptionsItemProps<API.ItemData>[];
  onClose: () => void;
};

const Show: React.FC<ShowProps> = (props) => {
  const { open, currentRow, columns, onClose } = props;
  const intl = useIntl();

  // 套餐订单状态枚举
  const PackageOrderStatusEnum = {
    pending: { text: intl.formatMessage({ id: 'packageOrder.status.pending' }), status: 'warning' },
    active: { text: intl.formatMessage({ id: 'packageOrder.status.active' }), status: 'success' },
    expired: { text: intl.formatMessage({ id: 'packageOrder.status.expired' }), status: 'error' },
  };

  // 支付类型枚举
  const PaymentTypeEnum = {
    trx: { text: intl.formatMessage({ id: 'packageOrder.paymentType.trx' }), status: 'processing' },
    usdt: { text: intl.formatMessage({ id: 'packageOrder.paymentType.usdt' }), status: 'default' },
  };

  return (
    <Modal
      title={intl.formatMessage({ id: 'packageOrder.detail.title' })}
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <ProDescriptions
        column={2}
        dataSource={currentRow}
        columns={columns.map((col) => {
          if (col.dataIndex === 'status') {
            return {
              ...col,
              render: (value: any) => (
                <Tag
                  color={
                    PackageOrderStatusEnum[value as keyof typeof PackageOrderStatusEnum]?.status
                  }
                >
                  {PackageOrderStatusEnum[value as keyof typeof PackageOrderStatusEnum]?.text}
                </Tag>
              ),
            };
          }
          if (col.dataIndex === 'paymentType') {
            return {
              ...col,
              render: (value: any) => (
                <Tag color={PaymentTypeEnum[value as keyof typeof PaymentTypeEnum]?.status}>
                  {PaymentTypeEnum[value as keyof typeof PaymentTypeEnum]?.text}
                </Tag>
              ),
            };
          }
          return col;
        })}
      />
    </Modal>
  );
};

export default Show;
