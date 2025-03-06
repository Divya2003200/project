
// import axios from "axios";

// const API_BASE_URL = "https://dummyjson.com/carts";

// export const fetchCarts = async () => {
//   const response = await axios.get(API_BASE_URL);
//   return response.data;
// };

// export const addItemToCart = async (cartData: { userId: number; products: { id: number; quantity: number }[] }) => {
//   const response = await axios.post(`${API_BASE_URL}/add`, cartData);
//   return response.data;
// };

// export const updateCart = async (cartId: number, products: { id: number; quantity: number }[]) => {
//   // Using "merge: true" to simulate updating while preserving details.
//   const response = await axios.put(`${API_BASE_URL}/${cartId}`, { merge: true, products });
//   return response.data;
// };

// export const removeCart = async (id: number) => {
//   await axios.delete(`${API_BASE_URL}/${id}`);
// };
import axios from "axios";

const API_BASE_URL = "https://dummyjson.com/carts";

export const fetchCarts = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

export const addItemToCart = async (cartData: { userId: number; products: { id: number; quantity: number }[] }) => {
  const response = await axios.post(`${API_BASE_URL}/add`, cartData);
  return response.data;
};

export const updateCart = async (cartId: number, products: { id: number; quantity: number }[]) => {
  // Using "merge: true" to simulate updating while preserving details.
  const response = await axios.put(`${API_BASE_URL}/${cartId}`, { merge: true, products });
  return response.data;
};

export const removeCart = async (id: number) => {
  await axios.delete(`${API_BASE_URL}/${id}`);
};
