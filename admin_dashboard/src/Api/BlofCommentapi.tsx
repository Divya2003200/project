import axios from "axios";

const API_BASE_URL = "https://dummyjson.com";

export const getPosts = async () => {
  const response = await axios.get(`${API_BASE_URL}/posts`);
  return response.data;
};

export const getPostDetails = async (id: string) => {
  const response = await axios.get(`${API_BASE_URL}/posts/${id}`);
  return response.data;
};

export const getComments = async () => {
  const response = await axios.get(`${API_BASE_URL}/comments`);
  return response.data;
};

export const addComment = async (comment: { postId: number; body: string; userId: number }) => {
  const response = await axios.post(`${API_BASE_URL}/comments/add`, comment);
  return response.data;
};
