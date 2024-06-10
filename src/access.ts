export const ROLES = {
  SuperAdmin: 'SUPER_ADMIN',
  Admin: 'ADMIN',
  Customer: 'CUSTOMER',
  OrderPlacer: 'ORDER_PLACER', // New role for placing orders
  Reviewer: 'REVIEWER', // New role for reviewing orders
  CustomerService: 'CUSTOMER_SERVICE', // New role for customer service
} as const;

export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};

  return {
    canSuperAdmin: currentUser && currentUser.role === ROLES.SuperAdmin,
    canSeeTasks:
      currentUser &&
      (currentUser.role === ROLES.Customer ||
        currentUser.role === ROLES.Admin ||
        currentUser.role === ROLES.OrderPlacer ||
        currentUser.role === ROLES.SuperAdmin),
    // Check if the user is either in the specific role or a SuperAdmin for broader access
    canCustomer:
      currentUser &&
      (currentUser.role === ROLES.Customer ||
        currentUser.role === ROLES.Admin ||
        currentUser.role === ROLES.SuperAdmin),
    canOrderClerk:
      currentUser &&
      (currentUser.role === ROLES.OrderPlacer ||
        currentUser.role === ROLES.Admin ||
        currentUser.role === ROLES.SuperAdmin),
    canFinancialStaff:
      currentUser && (currentUser.role === ROLES.Admin || currentUser.role === ROLES.SuperAdmin),
    canAdmin:
      currentUser && (currentUser.role === ROLES.Admin || currentUser.role === ROLES.SuperAdmin),
  };
}
