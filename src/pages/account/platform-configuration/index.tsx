import { Card, message, Typography, Button, Space } from 'antd';
import React, { useState } from 'react';
import { useIntl } from '@umijs/max';
import { useModel } from '@umijs/max';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { updateItem } from '@/services/ant-design-pro/api';
import { EditOutlined, CloseOutlined } from '@ant-design/icons';

const { Text } = Typography;

const PlatformConfiguration: React.FC = () => {
  const intl = useIntl();
  const { initialState, refresh } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (values: { name: string }) => {
    try {
      setLoading(true);
      await updateItem('/auth/profile', values);
      message.success(intl.formatMessage({ id: 'update.success' }));
      await refresh();
      setIsEditing(false);
    } catch (error: any) {
      message.error(error.message || intl.formatMessage({ id: 'update.failed' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Card
        title={
          <Space>
            {intl.formatMessage({ id: 'menu.account.platformConfig', defaultMessage: '平台配置' })}
            {isEditing ? (
              <Button type="link" icon={<CloseOutlined />} onClick={() => setIsEditing(false)}>
                {intl.formatMessage({ id: 'cancel', defaultMessage: '取消' })}
              </Button>
            ) : (
              <Button type="link" icon={<EditOutlined />} onClick={() => setIsEditing(true)}>
                {intl.formatMessage({ id: 'edit', defaultMessage: '编辑' })}
              </Button>
            )}
          </Space>
        }
      >
        {isEditing ? (
          <ProForm
            onFinish={handleSubmit}
            initialValues={{
              name: currentUser?.name || '',
            }}
            submitter={{
              submitButtonProps: {
                loading,
              },
            }}
          >
            <ProFormText
              width="xl"
              name="name"
              label={intl.formatMessage({ id: 'platform.name', defaultMessage: '名称' })}
              placeholder={intl.formatMessage({
                id: 'please.enter.name',
                defaultMessage: '请输入名称',
              })}
            />
          </ProForm>
        ) : (
          <div style={{ padding: '8px 0' }}>
            <div style={{ marginBottom: 16 }}>
              <Text strong>
                {intl.formatMessage({ id: 'platform.name', defaultMessage: '名称' })}:{' '}
              </Text>
              <Text>{currentUser?.name || '-'}</Text>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PlatformConfiguration;
