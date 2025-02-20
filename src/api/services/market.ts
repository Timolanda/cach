import { api } from '../config';
import { Order, Trade } from '@/types/market';

export const marketService = {
  async getOrders(assetId?: string): Promise<Order[]> {
    const { data } = await api.get('/orders', { params: { assetId } });
    return data;
  },

  async createOrder(params: Omit<Order, 'id'>): Promise<Order> {
    const { data } = await api.post('/orders', params);
    return data;
  },

  async fillOrder(orderId: string): Promise<Trade> {
    const { data } = await api.post(`/orders/${orderId}/fill`);
    return data;
  },

  async cancelOrder(orderId: string): Promise<void> {
    await api.delete(`/orders/${orderId}`);
  },

  async getTrades(assetId?: string): Promise<Trade[]> {
    const { data } = await api.get('/trades', { params: { assetId } });
    return data;
  }
}; 