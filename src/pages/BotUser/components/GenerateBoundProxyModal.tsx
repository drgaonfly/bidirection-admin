import { useIntl } from '@umijs/max';
import React, { useState } from 'react';
import { ModalForm, ProFormRadio, ProFormText } from '@ant-design/pro-components';

interface Props {
  open: boolean;
  onOpenChange: (visible: boolean) => void;
  onFinish: (values: any) => Promise<void>;
  loading?: boolean;
}

const GenerateBoundProxyModal: React.FC<Props> = ({ open, onOpenChange, onFinish, loading }) => {
  const intl = useIntl();
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');

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
          <ProFormText
            name="name"
            width="md"
            label={intl.formatMessage({ id: 'name' })}
            rules={[{ required: true }]}
            placeholder={'jack'}
          />
          <ProFormText
            name="email"
            width="md"
            label={intl.formatMessage({ id: 'email' })}
            rules={[{ required: true, type: 'email' }]}
            placeholder={'jack@gmail.com'}
          />
          <ProFormText.Password
            name="password"
            width="md"
            label={intl.formatMessage({ id: 'password' })}
            rules={[{ required: true }]}
            placeholder={'abcd1234'}
          />
        </>
      )}
    </ModalForm>
  );
};

export default GenerateBoundProxyModal;
