// components/StringArrayWithActions.tsx
import React from 'react';
import { Tag, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

interface Props {
  values: string[];
  onAdd?: () => void;
  onDelete?: () => void;
  labelAdd?: string;
  labelDelete?: string;
  color?: string;
}

const StringArrayWithActions: React.FC<Props> = ({
  values,
  onAdd,
  onDelete,
  labelAdd,
  labelDelete,
  color = 'blue',
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      {/* 左侧标签列 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {(values || []).map((val) => (
          <Tag color={color} key={val}>
            @{val}
          </Tag>
        ))}
      </div>

      {/* 右侧操作按钮，垂直居中 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 12,
          marginLeft: 16,
        }}
      >
        {onAdd && (
          <Typography.Link onClick={onAdd}>
            <PlusOutlined /> {labelAdd}
          </Typography.Link>
        )}
        {onDelete && (
          <Typography.Link onClick={onDelete} type="danger">
            <DeleteOutlined /> {labelDelete}
          </Typography.Link>
        )}
      </div>
    </div>
  );
};

export default StringArrayWithActions;
