import { apiClient } from './client';

export const walletApi = {
  getBalance: () =>
    apiClient.get('/wallet/balance/'),

  getTransactions: () =>
    apiClient.get('/wallet/transactions/'),
};
