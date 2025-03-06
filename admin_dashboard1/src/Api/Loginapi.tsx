import axios from 'axios';

export const loginUser = async (username: string, password: string) => {
    try {
        const response = await axios.post('https://dummyjson.com/auth/login', {
            username,
            password
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        return response.data; 
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Invalid username or password');
    }
};
