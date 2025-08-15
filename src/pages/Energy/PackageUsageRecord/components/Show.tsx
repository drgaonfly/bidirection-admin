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

  // 使用状态枚举
  const UsageStatusEnum = {
    success: {
      text: intl.formatMessage({ id: 'packageUsageRecord.status.success' }),
      status: 'success',
    },
    failed: {
      text: intl.formatMessage({ id: 'packageUsageRecord.status.failed' }),
      status: 'error',
    },
    pending: {
      text: intl.formatMessage({ id: 'packageUsageRecord.status.pending' }),
      status: 'warning',
    },
  };

  return (
    <Modal
      title={intl.formatMessage({ id: 'packageUsageRecord.detail.title' })}
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
                <Tag color={UsageStatusEnum[value as keyof typeof UsageStatusEnum]?.status}>
                  {UsageStatusEnum[value as keyof typeof UsageStatusEnum]?.text}
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
