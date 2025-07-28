import { useIntl } from '@umijs/max';
import React, { useState } from 'react';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { Radio } from 'antd';

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
      <Radio.Group
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        style={{ marginBottom: 16 }}
      >
        <Radio.Button value="auto">{intl.formatMessage({ id: 'auto_generate' })}</Radio.Button>
        <Radio.Button value="manual">{intl.formatMessage({ id: 'manual_generate' })}</Radio.Button>
      </Radio.Group>
      {mode === 'manual' && (
        <>
          <ProFormText
            name="name"
            label={intl.formatMessage({ id: 'name' })}
            rules={[{ required: true }]}
          />
          <ProFormText
            name="email"
            label={intl.formatMessage({ id: 'email' })}
            rules={[{ required: true, type: 'email' }]}
          />
          <ProFormText.Password
            name="password"
            label={intl.formatMessage({ id: 'password' })}
            rules={[{ required: true }]}
          />
        </>
      )}
    </ModalForm>
  );
};

export default GenerateBoundProxyModal;
