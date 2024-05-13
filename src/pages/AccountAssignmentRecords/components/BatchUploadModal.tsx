import { Form, message } from 'antd';
import { ModalForm } from '@ant-design/pro-components';
import { useState } from 'react';
import AliyunOSSUpload from '@/components/AliyunOSSUpload';
import { useIntl } from '@umijs/max';
interface Props {
  open: boolean;
  onOpenChange: (visible: boolean) => void;
  onFinish: (formData: any) => Promise<void>;
}

const BatchUploadModal: React.FC<Props> = ({ open, onOpenChange, onFinish }) => {
  const [file, setFile] = useState<string>('');
  const intl = useIntl();
  return (
    <ModalForm
      title={intl.formatMessage({ id: 'batch_upload_account' })}
      open={open}
      onOpenChange={onOpenChange}
      modalProps={{
        destroyOnClose: true,
        maskClosable: false,
      }}
      onFinish={async (values: any) => {
        // 确保在提交前已经上传了图片和资源
        if (!file) {
          message.error(intl.formatMessage({ id: 'ensure_upload_file' }));
          return;
        }
        // 将图片和资源URL添加到表单数据中
        await onFinish({
          ...values,
          file,
        });
      }}
    >
      <Form.Item label={intl.formatMessage({ id: 'table_file' })} name="file">
        <div style={{ marginBottom: '30px' }}>
          <a href="https://backend.maomaozhaocai.com/api/static/账号库模板.xlsx" download>
            {intl.formatMessage({ id: 'download_template' })}
          </a>
        </div>
        <AliyunOSSUpload
          onFileUpload={(url: string) => {
            console.log('Uploaded file URL:', url);
            setFile!(url);
          }}
          accept=".xls,.xlsx"
        />
      </Form.Item>
    </ModalForm>
  );
};

export default BatchUploadModal;
