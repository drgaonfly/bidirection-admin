import component from './zh-CN/component';
import globalHeader from './zh-CN/globalHeader';
import menu from './zh-CN/menu';
import pages from './zh-CN/pages';
import pwa from './zh-CN/pwa';
import settingDrawer from './zh-CN/settingDrawer';
import settings from './zh-CN/settings';
import app from './zh-CN/app';

export default {
  'navBar.lang': '语言',
  'layout.user.link.help': '帮助',
  'layout.user.link.privacy': '隐私',
  'layout.user.link.terms': '条款',
  'app.preview.down.block': '下载此页面到本地项目',
  'app.welcome.link.fetch-blocks': '获取全部区块',
  'app.welcome.link.block-list': '基于 block 开发，快速构建标准页面',
  ...pages,
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...app,
  amount: '金额',
  rate: '费率',
  fixedRate: '固定汇率',
  transactionType: '交易类型',
  'transactionType.income': '收入',
  'transactionType.issue': '支出',
  createdAt: '创建时间',
  updatedAt: '更新时间',

  // 表单提示文字
  'enter.amount': '请输入金额',
  'enter.rate': '请输入费率',
  'enter.fixedRate': '请输入固定汇率',
  'select.transactionType': '请选择交易类型',
  'menu.bills': '账单',
  list: '列表',

  // Bot 相关字段
  botId: '机器人ID',
  botToken: '机器人Token',
  botUsername: '机器人用户名',
  botName: '机器人名称',
  telegramId: 'Telegram ID',
  telegramUsername: 'Telegram 用户名',

  // 操作相关
  create: '创建',
  modify: '修改',
  edit: '编辑',
  delete: '删除',

  // 提示信息
  'please.enter': '请输入',
  confirm_delete: '确认删除',
  confirm_delete_content: '确定要删除这条记录吗？',
  confirm: '确认',
  cancel: '取消',

  // 操作反馈
  'Added successfully': '添加成功',
  'Adding failed, please try again!': '添加失败，请重试！',
  'Updated successfully': '更新成功',
  'Update failed, please try again!': '更新失败，请重试！',
  'Deleted successfully and will refresh soon': '删除成功，即将刷新',
  'Delete failed, please try again': '删除失败，请重试',

  // 表格相关
  'pages.searchTable.titleOption': '操作',
  'pages.searchTable.new': '新建',
  'pages.searchTable.chosen': '已选择',
  'pages.searchTable.item': '项',
  'pages.searchTable.batchDeletion': '批量删除',

  // 模态框相关
  'modal.delete.title': '删除确认',
  'modal.delete.content': '确定要删除选中的记录吗？',
  'modal.okText': '确认',
  'modal.cancelText': '取消',

  // 表格相关
  'pages.searchTable.updateForm.title': '编辑机器人',
  'pages.searchTable.form.botId': '机器人ID',
  'pages.searchTable.form.botToken': '机器人Token',
  'pages.searchTable.form.botUsername': '机器人用户名',
  'pages.searchTable.form.botName': '机器人名称',
  'pages.searchTable.form.telegramId': 'Telegram ID',
  'pages.searchTable.form.telegramUsername': 'Telegram 用户名',
  'pages.searchTable.form.placeholder': '请输入',
  'pages.searchTable.form.required': '此项为必填项',
  description: '描述',
  'pages.searchTable.form.description.placeholder': '请输入机器人描述',
  'menu.bot': '机器人管理',
  'pages.bot.list': '列表',
};
