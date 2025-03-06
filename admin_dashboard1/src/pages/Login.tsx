
import React from 'react';
import { useForm } from 'react-hook-form';
import { loginUser } from '../Api/Loginapi';
import { useAuthStore } from '../stores/Authstore';
import { Box, Button, Input, Text, VStack, Heading } from '@chakra-ui/react';
import {  useNavigate } from 'react-router-dom';

interface FormData {
    username: string;
    password: string;
}

const Login: React.FC = () => {
    const { register, handleSubmit, setError, formState: { errors } } = useForm<FormData>();
    const setToken = useAuthStore(state => state.setToken);
    const navigate = useNavigate(); 

    const onSubmit = async (data: FormData) => {
        console.log('Submitting:', data);  
        try {
            const response = await loginUser(data.username, data.password);
            console.log('Login successful:', response);
            setToken(response.token);
            alert(`Welcome ${response.firstName}!`);
            navigate('/Dashboard')

        } catch (error: any) {
            console.error('Login failed:', error.message);
            setError('username', { type: 'manual', message: 'Invalid username or password' });
        }
    };

    return (
        <Box 
            width="400px" 
            p={4} 
            boxShadow="md" 
            borderRadius="lg" 
            bg="pink.100" 
            margin="auto"
            position="fixed"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
        >
            <Heading size="lg" textAlign="center" mb={2}>Login</Heading>
            <VStack spacing={3} as="form" onSubmit={handleSubmit(onSubmit)}>
                <Input 
                    placeholder="Username" 
                    {...register('username', { required: 'Username is required' })} 
                    border="1px solid black"
                />
                {errors.username && <Text color="red.500">{errors.username.message}</Text>}

                <Input 
                    type="password" 
                    placeholder="Password" 
                    {...register('password', { required: 'Password is required' })} 
                    border="1px solid black"
                />
                {errors.password && <Text color="red.500">{errors.password.message}</Text>}

                <Button colorScheme="blue" type="submit" width="full">Login</Button>
            </VStack>
        </Box>
    );
};

export default Login;
