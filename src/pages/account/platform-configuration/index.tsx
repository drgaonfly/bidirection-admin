import { Card, message, Typography, Button, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useIntl } from '@umijs/max';
import { useModel } from '@umijs/max';
import { ProForm, ProFormDigit, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { updateItem } from '@/services/ant-design-pro/api';
import { EditOutlined, CloseOutlined } from '@ant-design/icons';
import { getSuperAdminEnergyPerTimes } from '@/services/ant-design-pro/api';

const { Text } = Typography;

const PlatformConfiguration: React.FC = () => {
  const intl = useIntl();
  const { initialState, refresh } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [energyPerTimes, setEnergyPerTimes] = useState(0);

  useEffect(() => {
    const fetchEnergyPerTimes = async () => {
      try {
        const { data, success } = await getSuperAdminEnergyPerTimes();

        if (success) {
          console.log('energy_per_times', data.energy_per_times);
          setEnergyPerTimes(data.energy_per_times);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchEnergyPerTimes();
  }, [currentUser]);

  const handleSubmit = async (values: {
    rechargeAddress: string;
    energy_privateKey: string;
    mnemonic: string;
    energy_address: string;
    recycle_min: number;
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
              recharge_min: currentUser?.recharge_min || 0,
              recharge_max: currentUser?.recharge_max || 0,
              rechargeAddress: currentUser?.rechargeAddress || '',
              energy_address: currentUser?.energy_address || '',
              energy_privateKey: currentUser?.energy_privateKey || '',
              mnemonic: currentUser?.mnemonic || '',
              energy_per_times: currentUser?.energy_per_times || 0,
              recycle_min: currentUser?.recycle_min || 12,
            }}
            submitter={{
              submitButtonProps: {
                loading,
              },
            }}
          >
            {/* <ProFormText
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
            /> */}
            <ProFormDigit
              width="xl"
              name="recharge_min"
              label={intl.formatMessage({
                id: 'platform.rechargeMin',
                defaultMessage: '充值最小值 (%)',
              })}
              placeholder={intl.formatMessage({
                id: 'please.enter.rechargeMin',
                defaultMessage: '请输入充值最小百分比',
              })}
              min={0}
              max={100}
              fieldProps={{
                addonAfter: '%',
              }}
            />
            <ProFormDigit
              width="xl"
              name="recharge_max"
              label={intl.formatMessage({
                id: 'platform.rechargeMax',
                defaultMessage: '充值最大值 (%)',
              })}
              placeholder={intl.formatMessage({
                id: 'please.enter.rechargeMax',
                defaultMessage: '请输入充值最大百分比',
              })}
              min={0}
              max={100}
              fieldProps={{
                addonAfter: '%',
              }}
            />
            <ProFormDigit
              width="xl"
              name="energy_per_times"
              label={intl.formatMessage({
                id: 'platform.energyPerTimes',
                defaultMessage: '每笔能量消耗 (sun)',
              })}
              placeholder={intl.formatMessage({
                id: 'please.enter.energyPerTimes',
                defaultMessage: '请输入每笔能量消耗 (sun)',
              })}
              min={0}
              defaultValue={energyPerTimes}
            />
            <ProFormDigit
              width="xl"
              name="recycle_min"
              label={intl.formatMessage({
                id: 'platform.recycle_min',
                defaultMessage: '最低消费笔数',
              })}
              placeholder={intl.formatMessage({
                id: 'please.enter.recycle_min',
                defaultMessage: '最低消费笔数',
              })}
              min={0}
            />
            <ProFormText
              width="xl"
              name="energy_privateKey"
              label={intl.formatMessage({ id: 'platform.privateKey', defaultMessage: '能量私钥' })}
              placeholder={intl.formatMessage({
                id: 'please.enter.privateKey',
                defaultMessage: '请输入私钥',
              })}
            />
            <ProFormText
              width="xl"
              name="energy_address"
              label={intl.formatMessage({
                id: 'platform.energy_address',
                defaultMessage: '能量地址',
              })}
              placeholder={intl.formatMessage({
                id: 'please.enter.energy_address',
                defaultMessage: '请输入能量的地址',
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
            {/* <div style={{ marginBottom: 16 }}>
              <Text strong>
                {intl.formatMessage({ id: 'platform.rechargeAddress', defaultMessage: '充值地址' })}
                :{' '}
              </Text>
              <Text>{currentUser?.rechargeAddress || '-'}</Text>
            </div> */}
            <div style={{ marginBottom: 16 }}>
              <Text strong>
                {intl.formatMessage({
                  id: 'platform.rechargeMin',
                  defaultMessage: '充值最小值 (%)',
                })}
                :{' '}
              </Text>
              <Text>{currentUser?.recharge_min ?? '-'}</Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>
                {intl.formatMessage({
                  id: 'platform.rechargeMax',
                  defaultMessage: '充值最大值 (%)',
                })}
                :{' '}
              </Text>
              <Text>{currentUser?.recharge_max ?? '-'}</Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>
                {intl.formatMessage({
                  id: 'platform.energyPerTimes',
                  defaultMessage: '每次发送能量 (sun)',
                })}
                :{' '}
              </Text>
              <Text>{currentUser?.energy_per_times ?? '-'}</Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>
                {intl.formatMessage({
                  id: 'platform.recycle_min',
                  defaultMessage: '最低消费笔数',
                })}
                :{' '}
              </Text>
              <Text>{currentUser?.recycle_min ?? '-'}</Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>
                {intl.formatMessage({ id: 'platform.privateKey', defaultMessage: '发送能量私钥' })}:{' '}
              </Text>
              <Text>{'*'.repeat(20)}</Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>
                {intl.formatMessage({
                  id: 'platform.energy_address',
                  defaultMessage: '能量地址',
                })}
                :{' '}
              </Text>
              <Text>{currentUser?.energy_address || '-'}</Text>
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
