export const APP_PAGES = [
  'dashboard',
  'billing',
  'inventory',
  'itemRequest',
  'salesReport',
  'users',
  'settings',
];

export const isAppPage = (page) => APP_PAGES.includes(page);
