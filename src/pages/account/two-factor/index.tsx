import React, { useState } from 'react';
import { Alert, Button, message, Image, Input, Modal, Form, Space, Card, Switch } from 'antd';
import { addItem } from '@/services/ant-design-pro/api';
import { useIntl } from '@umijs/max';
import { useModel } from '@umijs/max';
import { flushSync } from 'react-dom';
import { PageContainer } from '@ant-design/pro-components';

const Disable2FAModal: React.FC<{ visible: boolean; onClose: () => void }> = ({
  visible,
  onClose,
}) => {
  const [form] = Form.useForm();
  const { refresh } = useModel('@@initialState');
  const intl = useIntl();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const response = await addItem('/auth/2fa/disable', values);

      if (response.success) {
        message.success(intl.formatMessage({ id: '2fa.disabled.success' }));
        refresh();
        onClose();
      }
    } catch (error: any) {
      message.error(error.message || intl.formatMessage({ id: 'operation.failed' }));
    }
  };

  return (
    <Modal
      title={intl.formatMessage({ id: 'disable.2fa.title' })}
      open={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      destroyOnClose
      width={600}
    >
      <Alert
        message={intl.formatMessage({ id: 'security.warning' })}
        description={intl.formatMessage({ id: 'disable.2fa.warning' })}
        type="warning"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Form form={form} layout="vertical">
        <Form.Item
          name="password"
          label={intl.formatMessage({ id: 'current.password' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'please.enter.password' }) }]}
        >
          <Input.Password placeholder={intl.formatMessage({ id: 'enter.password.confirm' })} />
        </Form.Item>

        <Form.Item
          name="token"
          label={intl.formatMessage({ id: 'verification.code.or.backup' })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'please.enter.verification.code' }),
            },
            {
              pattern: /^([A-Z0-9]{8}|[0-9]{6})$/,
              message: intl.formatMessage({ id: 'invalid.code.format' }),
            },
          ]}
        >
          <Input
            placeholder={intl.formatMessage({ id: 'enter.verification.or.backup' })}
            maxLength={8}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const TwoFactorAuth: React.FC = () => {
  const [content, setContent] = useState<string | undefined>(undefined);
  const [qrData, setQrData] = useState('');
  const [token, setToken] = useState('');
  const [setupLoading, setSetupLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [disableModalVisible, setDisableModalVisible] = useState(false);
  const intl = useIntl();

  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const is2FAEnabled = currentUser?.twoFAEnabled || false;

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleSetup = async () => {
    if (is2FAEnabled) {
      message.info(intl.formatMessage({ id: '2fa.already.enabled' }));
      return;
    }

    setSetupLoading(true);
    try {
      const response = await addItem('/auth/2fa/setup');
      if (response.success && response.qrCode) {
        setQrData(response.qrCode);
        setContent(undefined);
      } else {
        throw new Error(intl.formatMessage({ id: 'qr.code.not.received' }));
      }
    } catch (err: any) {
      setContent(err.message);
      setQrData('');
    } finally {
      setSetupLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!token || token.length !== 6) {
      message.error(intl.formatMessage({ id: 'verification.code.error' }));
      return;
    }

    setVerifyLoading(true);
    try {
      const response = await addItem('/auth/2fa/verify', { token });

      if (response.success) {
        message.success(intl.formatMessage({ id: '2fa.activated' }));
        await fetchUserInfo();
        setQrData('');
        setToken('');
        setContent(undefined);
      } else {
        message.error(intl.formatMessage({ id: 'verification.code.error' }));
      }
    } catch (err: any) {
      console.error(err);
      if (err?.response?.data?.message === 'Invalid 2FA token') {
        message.error(intl.formatMessage({ id: 'invalid.2fa.token' }));
      } else if (err?.response?.data?.message === '2FA not enabled for this user') {
        message.error(intl.formatMessage({ id: '2fa.not.setup' }));
      } else {
        setContent(err?.response?.data?.message);
      }
      setToken('');
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <PageContainer>
      <Card title={intl.formatMessage({ id: '2fa.settings.title' })} style={{ marginBottom: 24 }}>
        {content && (
          <Alert
            style={{
              marginBottom: 24,
              width: 330,
            }}
            message={content}
            type="error"
            showIcon
          />
        )}

        <Space direction="vertical">
          <Switch
            checked={is2FAEnabled}
            checkedChildren={intl.formatMessage({ id: '2fa.enabled' })}
            unCheckedChildren={intl.formatMessage({ id: '2fa.disabled' })}
            disabled
          />

          {is2FAEnabled ? (
            <>
              <Alert
                message={intl.formatMessage({ id: '2fa.enabled.message' })}
                type="success"
                showIcon
                style={{ marginBottom: 24 }}
              />
              <Button danger onClick={() => setDisableModalVisible(true)}>
                {intl.formatMessage({ id: 'disable.2fa' })}
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleSetup} loading={setupLoading}>
                {intl.formatMessage({ id: 'enable.2fa' })}
              </Button>

              {qrData && (
                <div style={{ marginTop: 20 }}>
                  <Image src={qrData} alt={intl.formatMessage({ id: 'qr.code' })} width={200} />
                  <Input
                    placeholder={intl.formatMessage({ id: 'enter.6.digit.code' })}
                    maxLength={6}
                    style={{ width: 200, margin: '20px 0' }}
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                  />
                  <Button
                    type="primary"
                    onClick={handleVerify}
                    loading={verifyLoading}
                    style={{ marginLeft: 8 }}
                  >
                    {intl.formatMessage({ id: 'confirm' })}
                  </Button>
                </div>
              )}
            </>
          )}
        </Space>
      </Card>

      <Disable2FAModal
        visible={disableModalVisible}
        onClose={() => setDisableModalVisible(false)}
      />
    </PageContainer>
  );
};

export default TwoFactorAuth;
