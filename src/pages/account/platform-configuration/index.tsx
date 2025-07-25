import { Card, message, Typography, Button, Space } from 'antd';
import React, { useState } from 'react';
import { useIntl } from '@umijs/max';
import { useModel } from '@umijs/max';
import { ProForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { updateItem } from '@/services/ant-design-pro/api';
import { EditOutlined, CloseOutlined } from '@ant-design/icons';

const { Text } = Typography;

const PlatformConfiguration: React.FC = () => {
  const intl = useIntl();
  const { initialState, refresh } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (values: {
    rechargeAddress: string;
    energy_privateKey: string;
    mnemonic: string;
  }) => {
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
              rechargeAddress: currentUser?.rechargeAddress || '',
              // energyAddress: currentUser?.energyAddress || '',
              energy_privateKey: currentUser?.energy_privateKey || '',
              mnemonic: currentUser?.mnemonic || '',
            }}
            submitter={{
              submitButtonProps: {
                loading,
              },
            }}
          >
            <ProFormText
              width="xl"
              name="rechargeAddress"
              label={intl.formatMessage({
                id: 'platform.rechargeAddress',
                defaultMessage: '充值地址',
              })}
              placeholder={intl.formatMessage({
                id: 'please.enter.rechargeAddress',
                defaultMessage: '请输入充值地址',
              })}
            />
            <ProFormText.Password
              width="xl"
              name="energy_privateKey"
              label={intl.formatMessage({ id: 'platform.privateKey', defaultMessage: '能量私钥' })}
              placeholder={intl.formatMessage({
                id: 'please.enter.privateKey',
                defaultMessage: '请输入私钥',
              })}
            />
            <ProFormTextArea
              width="xl"
              name="mnemonic"
              label={intl.formatMessage({
                id: 'platform.mnemonic',
                defaultMessage: 'TG会员助记词',
              })}
              placeholder={intl.formatMessage({
                id: 'please.enter.mnemonic',
                defaultMessage: '请输入TG会员助记词',
              })}
            />
          </ProForm>
        ) : (
          <div style={{ padding: '8px 0' }}>
            <div style={{ marginBottom: 16 }}>
              <Text strong>
                {intl.formatMessage({ id: 'platform.rechargeAddress', defaultMessage: '充值地址' })}
                :{' '}
              </Text>
              <Text>{currentUser?.rechargeAddress || '-'}</Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>
                {intl.formatMessage({ id: 'platform.privateKey', defaultMessage: '发送能量私钥' })}:{' '}
              </Text>
              <Text>{'*'.repeat(20)}</Text>
            </div>
            <div>
              <Text strong>
                {intl.formatMessage({ id: 'platform.mnemonic', defaultMessage: 'TG会员助记词' })}:{' '}
              </Text>
              <Text>{'*'.repeat(20)}</Text>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PlatformConfiguration;
