import { Card, message, Typography, Button, Space, Divider } from 'antd';
import React, { useState } from 'react';
import { useIntl } from '@umijs/max';
import { useModel } from '@umijs/max';
import { ProForm, ProFormText, ProFormDigit } from '@ant-design/pro-components';
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
    name: string;
    trx20_address?: string;
    topicSubscriptionMonthlyFee?: number;
    topic_mode_trial_period?: number;
  }) => {
    try {
      setLoading(true);
      await updateItem('/auth/profile', values);
      message.success(intl.formatMessage({ id: 'update.success', defaultMessage: '更新成功' }));
      await refresh();
      setIsEditing(false);
    } catch (error: any) {
      message.error(
        error.message || intl.formatMessage({ id: 'update.failed', defaultMessage: '更新失败' }),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Card
        title={
          <Space>
            {intl.formatMessage({
              id: 'menu.account.platformConfig',
              defaultMessage: '平台配置',
            })}
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
              trx20_address: currentUser?.trx20_address || '',
              topicSubscriptionMonthlyFee: currentUser?.topicSubscriptionMonthlyFee ?? 25,
              topic_mode_trial_period: (currentUser as any)?.topic_mode_trial_period ?? 1,
            }}
            submitter={{
              submitButtonProps: { loading },
            }}
          >
            <ProFormText
              width="xl"
              name="name"
              label={intl.formatMessage({
                id: 'platform.name',
                defaultMessage: '名称',
              })}
              placeholder={intl.formatMessage({
                id: 'please.enter.name',
                defaultMessage: '请输入名称',
              })}
            />
            <Divider>
              {intl.formatMessage({
                id: 'platform.subscription',
                defaultMessage: '话题订阅收款配置',
              })}
            </Divider>
            <ProFormText
              width="xl"
              name="trx20_address"
              label={intl.formatMessage({
                id: 'platform.trx20Address',
                defaultMessage: 'TRC20 收款地址',
              })}
              placeholder={intl.formatMessage({
                id: 'please.enter.trx20Address',
                defaultMessage: '请输入 TRC20-USDT 收款地址',
              })}
              rules={[
                {
                  pattern: /^T[a-zA-Z0-9]{33}$/,
                  message: intl.formatMessage({
                    id: 'invalid.trx20Address',
                    defaultMessage: '请输入有效的 TRC20 地址（T 开头，34位）',
                  }),
                },
              ]}
            />
            <ProFormDigit
              width="md"
              name="topicSubscriptionMonthlyFee"
              label={intl.formatMessage({
                id: 'platform.monthlyFee',
                defaultMessage: '话题订阅月费（USDT）',
              })}
              min={1}
              max={9999}
              fieldProps={{ precision: 2 }}
              placeholder="25"
            />
            <ProFormDigit
              width="md"
              name="topic_mode_trial_period"
              label={intl.formatMessage({
                id: 'platform.trialPeriod',
                defaultMessage: '话题模式免费试用期（天）',
              })}
              min={0}
              max={365}
              fieldProps={{ precision: 0 }}
              placeholder="1"
              tooltip={intl.formatMessage({
                id: 'platform.trialPeriod.tooltip',
                defaultMessage: '新机器人创建时自动获得的免费试用天数，0 表示不开启试用',
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

            <Divider>
              {intl.formatMessage({
                id: 'platform.subscription',
                defaultMessage: '话题订阅收款配置',
              })}
            </Divider>

            <div style={{ marginBottom: 16 }}>
              <Text strong>
                {intl.formatMessage({
                  id: 'platform.trx20Address',
                  defaultMessage: 'TRC20 收款地址',
                })}
                :{' '}
              </Text>
              <Text copyable={!!currentUser?.trx20_address}>
                {currentUser?.trx20_address || '-'}
              </Text>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text strong>
                {intl.formatMessage({
                  id: 'platform.monthlyFee',
                  defaultMessage: '话题订阅月费（USDT）',
                })}
                :{' '}
              </Text>
              <Text>{currentUser?.topicSubscriptionMonthlyFee ?? 25} USDT</Text>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text strong>
                {intl.formatMessage({
                  id: 'platform.trialPeriod',
                  defaultMessage: '话题模式免费试用期（天）',
                })}
                :{' '}
              </Text>
              <Text>{(currentUser as any)?.topic_mode_trial_period ?? 1} 天</Text>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PlatformConfiguration;
