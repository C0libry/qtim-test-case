export const PORT = 'PORT';
export const GET_ITEMS_REQUEST_URL = 'GET_ITEMS_REQUEST_URL';
export const APP_ID = 'APP_ID';
export const DEFAULT_CURRENCY = 'DEFAULT_CURRENCY';

export default () => ({
  [PORT]: process.env[PORT] || 3003,
  [GET_ITEMS_REQUEST_URL]: process.env[GET_ITEMS_REQUEST_URL] || 'https://api.skinport.com/v1/items',
  [APP_ID]: process.env[APP_ID] || 730,
  [DEFAULT_CURRENCY]: process.env[DEFAULT_CURRENCY] || 'EUR',
});
