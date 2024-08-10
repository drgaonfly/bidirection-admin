export const ROLES = {
  SuperAdmin: 'SUPER_ADMIN',
  Admin: 'ADMIN',
  Customer: 'CUSTOMER',
  OrderPlacer: 'ORDER_PLACER', // New role for placing orders
  Reviewer: 'REVIEWER', // New role for reviewing orders
  CustomerService: 'CUSTOMER_SERVICE', // New role for customer service
} as const;

// const checkPermission = (currentUser: API.CurrentUser, action: string, path: string) => {
//   return (
//     currentUser &&
//     currentUser.roles.some(
//       (role: any) => role.permissions && !!role.permissions.find((item: any) => item.action === action && item.path === path),
//     )
//   );
// };

// export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
//   const { currentUser } = initialState ?? {};
//   return {
//     canAdmin: currentUser && currentUser.isAdmin,
//     canUpdateRole: currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/roles/:id', "PUT")),
//     canCreateRole: currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/roles','POST')),
//     canUpdateUser: currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/users/:id','PUT')),
//     canDeleteUser: currentUser && (currentUser.isAdmin || checkPermission(currentUser, '/roles','Delete')),
//   };
// }

export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};

  return {
    canSuperAdmin: currentUser && currentUser.role === ROLES.SuperAdmin,

    // Check if the user is either in the specific role or a SuperAdmin for broader access
    canCustomer:
      currentUser &&
      (currentUser.role === ROLES.Customer ||
        currentUser.role === ROLES.Admin ||
        currentUser.role === ROLES.SuperAdmin),

    canCustomerService:
      currentUser &&
      (currentUser.role === ROLES.CustomerService ||
        currentUser.role === ROLES.Admin ||
        currentUser.role === ROLES.SuperAdmin),

    canAdmin:
      currentUser && (currentUser.role === ROLES.Admin || currentUser.role === ROLES.SuperAdmin),
  };
}
