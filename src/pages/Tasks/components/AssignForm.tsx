import { ProForm, ProFormText, ProFormSelect, ProFormDigit } from '@ant-design/pro-components';
import React from 'react';

interface Props {
  newRecord?: boolean;
  file?: string | undefined;
  setFile?: (url: string) => void;
}

const AssignForm: React.FC<Props> = () => {
  return (
    <>
      <ProForm.Group>
        <ProFormSelect
          rules={[{ required: true, message: '请选择平台' }]}
          width="md"
          label="平台"
          name="platform"
          valueEnum={{
            TikTok: 'TikTok',
            Shopify: 'Shopify',
          }}
        />
        <ProFormDigit
          rules={[{ required: false, message: '请输入单量' }]}
          width="md"
          label="单量"
          name="quantity"
        />
        <ProFormText
          rules={[{ required: false, message: '请输入店铺' }]}
          width="md"
          label="店铺"
          name="store"
        />
        <ProFormText
          rules={[{ required: false, message: '请输入订单号' }]}
          width="md"
          label="订单号"
          name="orderNumber"
        />
        <ProFormDigit
          rules={[{ required: false, message: '请输入金额' }]}
          width="md"
          label="金额"
          name="amount"
        />
        <ProFormText
          rules={[{ required: false, message: '请输入买手账号' }]}
          width="md"
          label="买手账号"
          name="buyerAccount"
        />
      </ProForm.Group>
    </>
  );
};

export default AssignForm;
