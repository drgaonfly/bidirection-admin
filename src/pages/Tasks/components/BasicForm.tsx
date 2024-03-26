import MyUpload from '@/components/MyUpload';
import { ProForm, ProFormSelect } from '@ant-design/pro-components';
import { Form } from 'antd';
import React from 'react';

interface Props {
  newRecord?: boolean;
  file?: string | undefined;
  setFile?: (url: string) => void;
}

const BasicForm: React.FC<Props> = (props) => {
  const { setFile, newRecord } = props;
  return (
    <>
      <ProForm.Group>
        <ProFormSelect
          rules={[{ required: true, message: '请选择国家' }]}
          width="md"
          label="国家"
          name="country"
          valueEnum={{
            Vietnam: '越南',
            Thailand: '泰国',
            Malaysia: '马来西亚',
            Philippines: '菲律宾',
            Indonesia: '印尼',
          }}
        />

        {newRecord && (
          <Form.Item label="上传文件" rules={[{ required: false }]} name="file">
            <MyUpload
              accept=".xls,.xlsx,.csv"
              onFileUpload={(url: string) => {
                // 处理上传文件后的逻辑，例如将 URL 设置到表单的某个字段
                console.log('Uploaded file URL:', url);
                setFile!(url);
              }}
            />
          </Form.Item>
        )}
      </ProForm.Group>
    </>
  );
};

export default BasicForm;
