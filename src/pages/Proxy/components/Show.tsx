import { ProDescriptions, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Modal } from 'antd';
import React from 'react';
import { EditableProTable, ProColumns } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Role } from '@/apiDataStructures/ApiDataStructure';

interface Props {
  onClose: (e: React.MouseEvent | React.KeyboardEvent) => void;
  open: boolean;
  currentRow: API.ItemData;
  columns: ProDescriptionsItemProps<API.ItemData>[];
}

type DataSourceType = {
  _id: string;
};

const Show: React.FC<Props> = (props) => {
  const intl = useIntl();
  const { onClose, open, currentRow, columns: cols } = props;
  const filteredColumns = cols.filter((col) => col.dataIndex !== 'option');
  const columns: ProColumns<DataSourceType>[] = [
    {
      title: intl.formatMessage({ id: 'name' }),
      dataIndex: 'name',
      copyable: true,
    },
    {
      title: intl.formatMessage({ id: 'email' }),
      dataIndex: 'email',
      copyable: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.employee.proxy' }),
      dataIndex: ['proxy', 'name'],
    },
    {
      title: intl.formatMessage({ id: 'role' }),
      dataIndex: 'roles',
      hideInSearch: true,
      renderText: (_, record: any) => {
        return record.roles?.map((role: Role) => role.name)?.join(', ');
      },
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width="60%"
      centered
      className="rounded-lg overflow-hidden"
    >
      {currentRow?._id && (
        <>
          <ProDescriptions<API.ItemData>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?._id,
            }}
            columns={filteredColumns as ProDescriptionsItemProps<API.ItemData>[]}
            style={{ marginTop: '20px' }}
            bordered
            labelStyle={{
              width: '10%',
              justifyContent: 'flex-end',
              padding: '8px 16px',
              backgroundColor: '#f0f0f0',
            }}
            contentStyle={{
              width: '50%',
              padding: '8px 16px',
            }}
            size="small"
            className="custom-descriptions"
          />
          <EditableProTable<DataSourceType>
            rowKey="_id"
            headerTitle={<FormattedMessage id="menu.list.employees" defaultMessage="员工" />}
            maxLength={5}
            scroll={{
              x: 960,
            }}
            recordCreatorProps={false}
            loading={false}
            columns={columns}
            value={[]}
            className="bg-white"
          />
        </>
      )}
    </Modal>
  );
};

export default Show;
