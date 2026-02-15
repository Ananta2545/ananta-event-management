export const AUTH = {
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  ME: "/auth/me",
};

export const ADMIN = {
  DASHBOARD: "/admin/dashboard",
  VENDORS: "/admin/vendors",
  VENDOR_BY_ID: (id) => `/admin/vendors/${id}`,
  EXTEND_MEMBERSHIP: (id) => `/admin/vendors/${id}/extend`,
  CANCEL_MEMBERSHIP: (id) => `/admin/vendors/${id}/cancel`,
  USERS: "/admin/users",
  USER_BY_ID: (id) => `/admin/users/${id}`,
  TRANSACTIONS: "/admin/transactions",
  REPORTS: "/admin/dashboard",
};

export const VENDOR = {
  DASHBOARD: "/vendor/dashboard",
  PRODUCTS: "/vendor/products",
  PRODUCT_BY_ID: (id) => `/vendor/products/${id}`,
  ORDERS: "/vendor/orders",
  ORDER_STATUS: (id) => `/vendor/orders/${id}/status`,
};

export const USER = {
  VENDORS: "/user/vendors",
  VENDOR_PRODUCTS: (id) => `/user/vendors/${id}/products`,
  ORDERS: "/user/orders",
  GUEST_LIST: "/user/guest-list",
  GUEST_BY_ID: (id) => `/user/guest-list/${id}`,
};
