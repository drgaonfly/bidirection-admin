import React from 'react';
import { ProForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
// import useQueryList from '@/hooks/useQueryList';
// import { useAccess } from '@umijs/max';

interface Props {
  newRecord?: boolean;
  file?: string | undefined;
  setFile?: (url: string) => void;
  reviewFile?: string | undefined;
  setReviewFile?: (url: string) => void;
  initialValues?: any;
}

const BasicForm: React.FC<Props> = ({}) => {
  // const access = useAccess();
  // const { items: users } = useQueryList('/users', access.canAdmin);

  return (
    <>
      <ProForm.Group>
        {/* {access.canAdmin && (
          <ProFormSelect
            rules={[{ required: true }]}
            options={users.map((user: any) => ({
              label: user.email,
              value: user._id,
            }))}
            width="md"
            name="user"
            label="用户"
            showSearch
          />
        )} */}
        <ProFormSelect
          name="country"
          label="国家"
          width="md"
          rules={[{ required: true, message: '请选择国家' }]}
          valueEnum={{
            Vietnam: '越南',
            Thailand: '泰国',
            Malaysia: '马来西亚',
            Philippines: '菲律宾',
            Indonesia: '印尼',
          }}
          placeholder="请选择国家"
        />

        <ProFormSelect
          name="platform"
          label="平台"
          width="md"
          rules={[{ required: true, message: '请选择平台' }]}
          valueEnum={{
            Shopee: 'Shopee',
            Lazada: 'Lazada',
            TikTok: 'TikTok',
          }}
          placeholder="请选择平台"
        />
        <ProFormText
          rules={[{ required: true }]}
          width="md"
          label="平台账号"
          name="storeAccount"
          placeholder="请输入平台账号"
        />
        <ProFormText
          rules={[{ required: false }]}
          width="md"
          label="窗口序号"
          name="serialNumber"
          placeholder="请输入窗口序号"
        />
        <ProFormText
          rules={[{ required: false }]}
          width="md"
          label="账号"
          name="accountNumber"
          placeholder="请输入账号"
        />
      </ProForm.Group>
    </>
  );
};

export default BasicForm;
