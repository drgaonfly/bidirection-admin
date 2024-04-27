import { locationMapping, platformNames } from '@/utils/constants';
import {
  ProForm,
  ProFormDigit,
  ProFormList,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { useAccess } from '@umijs/max';
import { Modal } from 'antd';
import { useForm } from 'antd/es/form/Form';

interface Props {
  open: boolean;
  onOpenChange: (visible: boolean) => void;
  onFinish: (formData: any) => Promise<void>;
}

const Create: React.FC<Props> = (props) => {
  const { open, onOpenChange, onFinish } = props;
  const access = useAccess();
  const [form] = useForm();
  return (
    <Modal
      title="新增"
      width="45%"
      open={open}
      onCancel={() => onOpenChange(false)}
      destroyOnClose={true}
      maskClosable={false}
      footer={null}
    >
      <ProForm
        form={form}
        onFinish={async (values) => {
          await onFinish(values);
          form.resetFields();
        }}
      >
        <ProForm.Group>
          <ProFormText
            rules={[{ required: true, message: '请输入姓名' }]}
            width="md"
            label="姓名"
            name="name"
          />
          <ProFormText
            rules={[{ required: true, message: '请输入电子邮箱' }]}
            width="md"
            label="电子邮箱"
            name="email"
          />
          <ProFormText
            rules={[{ required: true, message: '请输入密码' }]}
            width="md"
            label="密码"
            name="password"
          />
          {access.canSuperAdmin && (
            <ProFormSelect
              name="role"
              width="md"
              label="角色"
              valueEnum={{
                SUPER_ADMIN: '超级管理员',
                CUSTOMER: '客户',
                ORDER_CLERK: '下单员',
                ADMIN: '客服',
                FINANCIAL_STAFF: '财务人员',
              }}
            />
          )}
        </ProForm.Group>

        <ProFormList
          name="priceList"
          label="价格表"
          creatorButtonProps={{
            creatorButtonText: '添加价格规则',
          }}
        >
          {(field, index) => (
            <ProForm.Group key={field.key}>
              <ProForm.Group>
                <ProFormSelect
                  name="country"
                  label="国家"
                  width="md"
                  rules={[{ required: true, message: '请选择国家' }]}
                  valueEnum={locationMapping}
                  placeholder="请选择国家"
                />

                <ProFormSelect
                  name="platform"
                  label="平台"
                  width="md"
                  rules={[{ required: true, message: '请选择平台' }]}
                  valueEnum={platformNames}
                  placeholder="请选择平台"
                />
              </ProForm.Group>
              <ProFormRadio.Group
                name={[field.name, 'isLocalCurrency']}
                label="是否本币"
                width="lg"
                options={[
                  { label: '是', value: true },
                  { label: '否', value: false },
                ]}
                fieldProps={{
                  defaultValue: false,
                  onChange: () =>
                    form.setFieldsValue({
                      priceList: form
                        .getFieldValue('priceList')
                        .map((item: any, idx: number) =>
                          idx === index
                            ? { ...item, isLocalCurrency: !item.isLocalCurrency }
                            : item,
                        ),
                    }),
                }}
              />
              {!form.getFieldValue(['priceList', index, 'isLocalCurrency']) && (
                <ProForm.Group>
                  <ProFormDigit
                    name={[field.name, 'exchangeRate']}
                    label="汇率"
                    width="md"
                    min={0}
                    fieldProps={{ step: 0.01 }}
                    rules={[{ required: true, message: '请输入汇率' }]}
                  />
                  <ProFormDigit
                    name={[field.name, 'serviceFee']}
                    label="服务费"
                    width="md"
                    min={0}
                    fieldProps={{ step: 0.01 }}
                    rules={[{ required: true, message: '请输入服务费' }]}
                  />
                </ProForm.Group>
              )}
            </ProForm.Group>
          )}
        </ProFormList>
      </ProForm>
    </Modal>
  );
};

export default Create;
