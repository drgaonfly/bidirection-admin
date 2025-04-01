import React, { useState } from 'react';
import { Alert, Button, message, Image, Input } from 'antd';
import { addItem } from '@/services/ant-design-pro/api';
import { useIntl } from '@umijs/max';
import { useModel } from '@umijs/max';
import { flushSync } from 'react-dom';

const TwoFactorAuth: React.FC = () => {
  const [content, setContent] = useState<string | undefined>(undefined);
  const [qrData, setQrData] = useState('');
  const [token, setToken] = useState('');
  const [setupLoading, setSetupLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
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
        throw new Error('QR code data not received');
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
        // Note: 2FA status will be updated through initialState refresh
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
    <div style={{ padding: 20 }}>
      <div style={{ backgroundColor: 'white', padding: 20 }}>
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

        {is2FAEnabled ? (
          <Alert
            message={intl.formatMessage({ id: '2fa.enabled.message' })}
            type="success"
            showIcon
            style={{ marginBottom: 24 }}
          />
        ) : (
          <>
            <Button onClick={handleSetup} loading={setupLoading}>
              {intl.formatMessage({ id: 'enable.2fa' })}
            </Button>

            {qrData && (
              <div style={{ marginTop: 20 }}>
                <Image src={qrData} alt="QR Code" width={200} />
                <Input
                  placeholder={intl.formatMessage({ id: 'enter.6.digit.code' })}
                  maxLength={6}
                  style={{ width: 200, margin: '10px 0' }}
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                />
                <Button type="primary" onClick={handleVerify} loading={verifyLoading}>
                  {intl.formatMessage({ id: 'confirm' })}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TwoFactorAuth;
