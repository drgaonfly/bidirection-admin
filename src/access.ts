const checkPermission = (currentUser: API.CurrentUser, path: string, action: string) => {
  return (
    currentUser &&
    currentUser.roles.some(
      (role: any) =>
        role.permissions &&
        !!role.permissions.find((item: any) => item.action === action && item.path === path),
    )
  );
};

export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  return {
    canSuperAdmin: currentUser && currentUser.isAdmin,

    canUpdateRole:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/roles/:id', 'PUT')),
    canCreateRole:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/roles', 'POST')),
    canDeleteRole:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/roles', 'DELETE')),
    canGetRole:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/roles', 'GET')),

    canUpdateUser:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/users/:id', 'PUT')),
    canDeleteUser:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/users', 'Delete')),
    canCreateUser:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/users', 'POST')),
    canGetUser:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/users', 'GET')),

    canUpdateMenu:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/menus/:id', 'PUT')),
    canDeleteMenu:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/menus', 'DELETE')),
    canCreateMenu:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/menus', 'POST')),
    canGetMenu:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/menus', 'GET')),

    canUpdatePermission:
      currentUser &&
      (currentUser.isAdmin || checkPermission(currentUser, '/permissions/:id', 'PUT')),
    canDeletePermission:
      currentUser &&
      (currentUser.isAdmin || checkPermission(currentUser, '/permissions', 'DELETE')),
    canCreatePermission:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/permissions', 'POST')),
    canGetPermission:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/permissions', 'GET')),

    canUpdateDataPermission:
      currentUser &&
      (currentUser.isAdmin || checkPermission(currentUser, '/data-permissions/:id', 'PUT')),
    canDeleteDataPermission:
      currentUser &&
      (currentUser.isAdmin || checkPermission(currentUser, '/data-permissions', 'DELETE')),
    canCreateDataPermission:
      currentUser &&
      (currentUser.isAdmin || checkPermission(currentUser, '/data-permissions', 'POST')),
    canGetDataPermission:
      currentUser &&
      (currentUser.isAdmin || checkPermission(currentUser, '/data-permissions', 'GET')),

    canCreatePermissionGroup:
      currentUser &&
      (currentUser.isAdmin || checkPermission(currentUser, '/permission-groups', 'POST')),
    canDeletePermissionGroup:
      currentUser &&
      (currentUser.isAdmin || checkPermission(currentUser, '/permission-groups', 'DELETE')),
    canUpdatePermissionGroup:
      currentUser &&
      (currentUser.isAdmin || checkPermission(currentUser, '/permission-groups/:id', 'PUT')),
    canGetPermissionGroup:
      currentUser &&
      (currentUser.isAdmin || checkPermission(currentUser, '/permission-groups', 'GET')),

    //withdraws权限
    canCreateWithdraw:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/withdraws', 'POST')),
    canDeleteWithdraw:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/withdraws', 'DELETE')),
    canUpdateWithdraw:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/withdraws/:id', 'PUT')),
    canGetWithdraw:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/withdraws', 'GET')),
    canCheckWithdraw:
      currentUser &&
      (currentUser.isAdmin || checkPermission(currentUser, '/withdraws/:id/check', 'PUT')),

    // proxy权限
    canCreateProxy:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/proxies', 'POST')),
    canDeleteProxy:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/proxies', 'DELETE')),
    canUpdateProxy:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/proxies/:id', 'PUT')),
    canGetProxy:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/proxies', 'GET')),
    canGetProxyDetail:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/users/:id', 'GET')),

    // employee权限
    canCreateEmployee:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/employees', 'POST')),
    canDeleteEmployee:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/employees', 'DELETE')),
    canUpdateEmployee:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/employees/:id', 'PUT')),
    canGetEmployee:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/employees', 'GET')),
    canGetEmployeeDetail:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/users/:id', 'GET')),

    // customer权限
    canCreateCustomer:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/customers', 'POST')),
    canDeleteCustomer:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/customers', 'DELETE')),
    canUpdateCustomer:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/customers/:id', 'PUT')),
    canGetCustomer:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/customers', 'GET')),

    // 机器人权限
    canCreateBot:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/bots', 'POST')),
    canDeleteBot:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/bots', 'DELETE')),
    canUpdateBot:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/bots/:id', 'PUT')),
    canGetBot: currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/bots', 'GET')),

    // 机器人用户权限
    canCreateBotUser:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/bot-users', 'POST')),
    canDeleteBotUser:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/bot-users', 'DELETE')),
    canUpdateBotUser:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/bot-users/:id', 'PUT')),
    canGetBotUser:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/bot-users', 'GET')),

    // Transaction权限
    canCreateTransaction:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/transactions', 'POST')),
    canDeleteTransaction:
      currentUser &&
      (currentUser.isAdmin || checkPermission(currentUser, '/transactions', 'DELETE')),
    canUpdateTransaction:
      currentUser &&
      (currentUser.isAdmin || checkPermission(currentUser, '/transactions/:id', 'PUT')),
    canGetTransaction:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/transactions', 'GET')),

    // Group权限
    canCreateGroup:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/groups', 'POST')),
    canDeleteGroup:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/groups', 'DELETE')),
    canUpdateGroup:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/groups/:id', 'PUT')),
    canGetGroup:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/groups', 'GET')),

    // Subscription权限
    canCreateSubscription:
      currentUser &&
      (currentUser.isAdmin || checkPermission(currentUser, '/subscriptions', 'POST')),
    canDeleteSubscription:
      currentUser &&
      (currentUser.isAdmin || checkPermission(currentUser, '/subscriptions', 'DELETE')),
    canUpdateSubscription:
      currentUser &&
      (currentUser.isAdmin || checkPermission(currentUser, '/subscriptions/:id', 'PUT')),
    canGetSubscription:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/subscriptions', 'GET')),

    // Payment权限
    canCreatePayment:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/payments', 'POST')),
    canDeletePayment:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/payments', 'DELETE')),
    canUpdatePayment:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/payments/:id', 'PUT')),
    canGetPayment:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/payments', 'GET')),

    // BotMessage
    canCreateBotMessage:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/bot-messages', 'POST')),
    canDeleteBotMessage:
      currentUser &&
      (currentUser.isAdmin || checkPermission(currentUser, '/bot-messages', 'DELETE')),
    canUpdateBotMessage:
      currentUser &&
      (currentUser.isAdmin || checkPermission(currentUser, '/bot-messages/:id', 'PUT')),
    canGetBotMessage:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/bot-messages', 'GET')),

    // Message
    canCreateMessage:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/messages', 'POST')),
    canDeleteMessage:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/messages', 'DELETE')),
    canUpdateMessage:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/messages/:id', 'PUT')),
    canGetMessage:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/messages', 'GET')),

    // Wallet
    canCreateWallet:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/wallets', 'POST')),
    canDeleteWallet:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/wallets', 'DELETE')),
    canUpdateWallet:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/wallets/:id', 'PUT')),
    canGetWallet:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/wallets', 'GET')),

    // Receipt
    canCreateReceipt:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/receipts', 'POST')),
    canDeleteReceipt:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/receipts', 'DELETE')),
    canUpdateReceipt:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/receipts/:id', 'PUT')),
    canGetReceipt:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/receipts', 'GET')),

    // Exchange
    canCreateExchange:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/exchanges', 'POST')),
    canDeleteExchange:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/exchanges', 'DELETE')),
    canUpdateExchange:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/exchanges/:id', 'PUT')),
    canGetExchange:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/exchanges', 'GET')),

    // GroupMessage
    canCreateGroupMessage:
      currentUser &&
      (currentUser.isAdmin || checkPermission(currentUser, '/group-messages', 'POST')),
    canDeleteGroupMessage:
      currentUser &&
      (currentUser.isAdmin || checkPermission(currentUser, '/group-messages', 'DELETE')),
    canUpdateGroupMessage:
      currentUser &&
      (currentUser.isAdmin || checkPermission(currentUser, '/group-messages/:id', 'PUT')),
    canGetGroupMessage:
      currentUser &&
      (currentUser.isAdmin || checkPermission(currentUser, '/group-messages', 'GET')),

    // BotUserConfig
    canCreateBotUserConfig:
      currentUser &&
      (currentUser.isAdmin || checkPermission(currentUser, '/bot-user-configs', 'POST')),
    canDeleteBotUserConfig:
      currentUser &&
      (currentUser.isAdmin || checkPermission(currentUser, '/bot-user-configs', 'DELETE')),
    canUpdateBotUserConfig:
      currentUser &&
      (currentUser.isAdmin || checkPermission(currentUser, '/bot-user-configs/:id', 'PUT')),
    canGetBotUserConfig:
      currentUser &&
      (currentUser.isAdmin || checkPermission(currentUser, '/bot-user-configs', 'GET')),

    // Rental
    canCreateRental:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/rentals', 'POST')),
    canDeleteRental:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/rentals', 'DELETE')),
    canUpdateRental:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/rentals/:id', 'PUT')),
    canGetRental:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/rentals', 'GET')),

    // member-orders
    canCreateMemberOrder:
      currentUser &&
      (currentUser.isAdmin || checkPermission(currentUser, '/member-orders', 'POST')),
    canDeleteMemberOrder:
      currentUser &&
      (currentUser.isAdmin || checkPermission(currentUser, '/member-orders', 'DELETE')),
    canUpdateMemberOrder:
      currentUser &&
      (currentUser.isAdmin || checkPermission(currentUser, '/member-orders/:id', 'PUT')),
    canGetMemberOrder:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/member-orders', 'GET')),

    // anynoumy
    canCreateAnynoumy:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/anynoumy', 'POST')),
    canDeleteAnynoumy:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/anynoumy', 'DELETE')),
    canUpdateAnynoumy:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/anynoumy/:id', 'PUT')),
    canGetAnynoumy:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/anynoumy', 'GET')),

    // Integer
    canCreateInteger:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/integer', 'POST')),
    canDeleteInteger:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/integer', 'DELETE')),
    canUpdateInteger:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/integer/:id', 'PUT')),
    canGetInteger:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/integer', 'GET')),
    // tg-stars-orders
    canCreateTgStarsOrder:
      currentUser &&
      (currentUser.isAdmin || checkPermission(currentUser, '/tg-stars-orders', 'POST')),
    canDeleteTgStarsOrder:
      currentUser &&
      (currentUser.isAdmin || checkPermission(currentUser, '/tg-stars-orders', 'DELETE')),
    canUpdateTgStarsOrder:
      currentUser &&
      (currentUser.isAdmin || checkPermission(currentUser, '/tg-stars-orders/:id', 'PUT')),
    canGetTgStarsOrder:
      currentUser &&
      (currentUser.isAdmin || checkPermission(currentUser, '/tg-stars-orders', 'GET')),

    // Advance
    canCreateAdvance:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/advances', 'POST')),
    canDeleteAdvance:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/advances', 'DELETE')),
    canUpdateAdvance:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/advances/:id', 'PUT')),
    canGetAdvance:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/advances', 'GET')),

    // Application
    canCreateApplication:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/applications', 'POST')),
    canDeleteApplication:
      currentUser &&
      (currentUser.isAdmin || checkPermission(currentUser, '/applications', 'DELETE')),
    canUpdateApplication:
      currentUser &&
      (currentUser.isAdmin || checkPermission(currentUser, '/applications/:id', 'PUT')),
    canGetApplication:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/applications', 'GET')),

    // Transfer
    canCreateTransfer:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/transfers', 'POST')),
    canDeleteTransfer:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/transfers', 'DELETE')),
    canUpdateTransfer:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/transfers/:id', 'PUT')),
    canGetTransfer:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/transfers', 'GET')),

    // Package
    canCreatePackage:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/packages', 'POST')),
    canDeletePackage:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/packages', 'DELETE')),
    canUpdatePackage:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/packages/:id', 'PUT')),
    canGetPackage:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/packages', 'GET')),

    // UnRental
    canCreateUnRental:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/unrentals', 'POST')),
    canDeleteUnRental:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/unrentals', 'DELETE')),
    canUpdateUnRental:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/unrentals/:id', 'PUT')),
    canGetUnRental:
      currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/unrentals', 'GET')),
  };
}
