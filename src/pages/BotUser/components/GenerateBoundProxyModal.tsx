import { useIntl } from '@umijs/max';
import React, { useEffect, useState } from 'react';
import { ModalForm, ProFormRadio, ProFormText, ProFormGroup } from '@ant-design/pro-components';
import { getRandomUser } from '../../../utils/ipGeo';

interface Props {
  open: boolean;
  onOpenChange: (visible: boolean) => void;
  onFinish: (values: any) => Promise<void>;
  loading?: boolean;
}

const GenerateBoundProxyModal: React.FC<Props> = ({ open, onOpenChange, onFinish, loading }) => {
  const intl = useIntl();
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [userInfo, setUserInfo] = useState<any>(null);

  const fetchUser = async () => {
    setUserInfo(await getRandomUser());
  };

  useEffect(() => {
    fetchUser();
  }, [open]);

  return (
    <ModalForm
      title={intl.formatMessage({ id: 'generate_bound_proxy' })}
      open={open}
      onOpenChange={(visible) => {
        onOpenChange(visible);
        if (!visible) setMode('auto'); // 关闭时重置模式
      }}
      onFinish={async (values: any) => {
        if (mode === 'auto') {
          await onFinish({});
        } else {
          await onFinish(values);
        }
        return true;
      }}
      modalProps={{
        destroyOnClose: true,
        confirmLoading: loading,
      }}
      submitter={{
        searchConfig: {
          submitText: intl.formatMessage({ id: 'ok', defaultMessage: '确定' }),
          resetText: intl.formatMessage({ id: 'cancel', defaultMessage: '取消' }),
        },
        resetButtonProps: {
          onClick: () => onOpenChange(false),
        },
      }}
    >
      <ProFormRadio.Group
        name="mode"
        options={[
          { label: intl.formatMessage({ id: 'auto_generate' }), value: 'auto' },
          { label: intl.formatMessage({ id: 'manual_generate' }), value: 'manual' },
        ]}
        fieldProps={{
          value: mode,
          onChange: (e) => setMode(e.target.value),
          style: { marginBottom: 16 },
        }}
        radioType="button"
      />
      {mode === 'manual' && (
        <>
          <ProFormGroup>
            <ProFormText
              name="name"
              width="md"
              label={intl.formatMessage({ id: 'name' })}
              rules={[{ required: true }]}
              initialValue={userInfo.name}
            />
            <ProFormText
              name="email"
              width="md"
              label={intl.formatMessage({ id: 'email' })}
              rules={[{ required: true }]}
              initialValue={userInfo.email}
            />
          </ProFormGroup>

          <ProFormText
            name="password"
            width="md"
            label={intl.formatMessage({ id: 'password' })}
            rules={[{ required: true }]}
            initialValue={userInfo.password}
          />
        </>
      )}
    </ModalForm>
  );
};

export default GenerateBoundProxyModal;
