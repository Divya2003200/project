import axios from "axios";

const API_BASE_URL = "https://dummyjson.com";

export interface Order {
  id: number;
  products: any[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
 
  status?: string;
}

export interface OrdersResponse {
  carts: Order[];
  total: number;
  skip: number;
  limit: number;
}

export const getOrders = async (): Promise<OrdersResponse> => {
  const response = await axios.get(`${API_BASE_URL}/carts`);
  return response.data;
};

export const getOrderDetails = async (id: number): Promise<Order> => {
  const response = await axios.get(`${API_BASE_URL}/carts/${id}`);
  return response.data;
};

export const updateOrderStatus = async (id: number, status: string): Promise<Order> => {
  // Note: DummyJSON doesn't really update orders, so we simulate a PATCH.
  const response = await axios.patch(`${API_BASE_URL}/carts/${id}`, { status });
  return response.data;
};

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export const getUser = async (userId: number): Promise<User> => {
  const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
  return response.data;
};
