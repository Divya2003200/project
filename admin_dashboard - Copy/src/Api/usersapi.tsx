import axios from "axios";

const API_URL = "https://dummyjson.com/users";

 
export const getAllUsers = async () => {
    const response = await axios.get(API_URL);
    return response.data.users; 
};
 

export const getUserById = async (id: number) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data; 
};

 
export const searchUserById = async (id: number) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data; 
};

 
export const filterUsersByGender = async (gender: string) => {
    const response = await axios.get(`${API_URL}/filter?key=gender&value=${gender}`);
    return response.data.users;
};

 
export const updateUser = async (id: number, userData: any) => {
    const response = await axios.put(`${API_URL}/${id}`, userData);
    return response.data;
};
