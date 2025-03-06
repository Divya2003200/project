import axios from "axios";

const API_URL = "https://dummyjson.com/users"; 

export const getUserById = async (id: number) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};
 
export const updateUser = async (id: number, userData: any) => {
    const response = await axios.patch(`${API_URL}/${id}`, userData, {
        headers: { "Content-Type": "application/json" },
    });
    return response.data;
};
