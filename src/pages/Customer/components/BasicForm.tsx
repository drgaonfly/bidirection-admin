import { useIntl } from '@umijs/max';
import React from 'react';
import { ProForm, ProFormText, ProFormSelect } from '@ant-design/pro-components';
import { Form, Input } from 'antd';
import AliyunOSSUpload from '@/components/AliyunOSSUpload';

interface Props {
  newRecord?: boolean;
  onFinish: (formData: any) => Promise<void>;
  setVideoUrl: (url: string) => void;
  videoUrl?: string | undefined;
  values?: any;
}

const BasicForm: React.FC<Props> = ({ newRecord, onFinish, values, setVideoUrl, videoUrl }) => {
  const intl = useIntl();

  const defaultFileList = videoUrl
    ? [
        {
          uid: '-1',
          name: 'video.mp4',
          status: 'done',
          url: videoUrl,
        },
      ]
    : [];

  return (
    <ProForm
      initialValues={{
        ...values,
        video: videoUrl,
      }}
      onFinish={async (values) => {
        await onFinish({
          ...values,
          video: videoUrl,
        });
      }}
      submitter={{
        render: (props, dom) => {
          return (
            <div style={{ textAlign: 'right' }}>
              {dom.map((button, index) => (
                <span key={index} style={{ marginLeft: 8 }}>
                  {button}
                </span>
              ))}
            </div>
          );
        },
      }}
    >
      <ProForm.Group>
        <ProFormText
          rules={[{ required: true, message: intl.formatMessage({ id: 'enter_username' }) }]}
          width="md"
          label={intl.formatMessage({ id: 'username' })}
          name="username"
        />

        <ProFormText
          rules={[
            { required: true, message: intl.formatMessage({ id: 'enter_email' }) },
            { type: 'email', message: intl.formatMessage({ id: 'invalid_email' }) },
          ]}
          width="md"
          label={intl.formatMessage({ id: 'email' })}
          name="email"
        />

        <ProFormText width="md" label={intl.formatMessage({ id: 'phone' })} name="phone" />

        <ProFormText width="md" label={intl.formatMessage({ id: 'wechat' })} name="wechat" />

        <ProFormText
          width="md"
          label={intl.formatMessage({ id: 'googleAccount' })}
          name="googleAccount"
        />

        <ProFormText width="md" label={intl.formatMessage({ id: 'address' })} name="address" />

        <Form.Item
          required
          label={intl.formatMessage({ id: 'video_url' })}
          name="video"
          validateFirst
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'please_upload_video' }),
            },
          ]}
        >
          <AliyunOSSUpload
            onFileUpload={(url: string) => {
              if (typeof setVideoUrl === 'function') {
                setVideoUrl(url);
              }
            }}
            accept=".mp4,.avi,.mov,.flv,.wmv"
            defaultFileList={defaultFileList}
          />
        </Form.Item>

        <ProFormSelect
          name="status"
          width="md"
          label={intl.formatMessage({ id: 'status' })}
          valueEnum={{
            active: {
              text: intl.formatMessage({ id: 'active', defaultMessage: '活跃' }),
              status: 'Success',
            },
            inactive: {
              text: intl.formatMessage({ id: 'inactive', defaultMessage: '不活跃' }),
              status: 'Error',
            },
          }}
          rules={[{ required: true, message: intl.formatMessage({ id: 'please_select_status' }) }]}
        />
      </ProForm.Group>

      {!newRecord && (
        <Form.Item name="_id" label={false}>
          <Input type="hidden" />
        </Form.Item>
      )}
    </ProForm>
  );
};

export default BasicForm;
