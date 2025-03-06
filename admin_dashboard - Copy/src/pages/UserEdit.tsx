
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, SubmitHandler } from "react-hook-form";
import { getUserById, updateUser } from "../Api/usersapi"; 
import { useUserStore } from "../stores/UserEditstore"; 
import { 
  Box, Button, Input, FormLabel, FormControl, FormErrorMessage, Select, Text 
} from "@chakra-ui/react";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  age: number;
}

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  age: number;
}

const EditUsers: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setUser } = useUserStore();
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors }
  } = useForm<FormValues>();

  
  const { data, isLoading, isError } = useQuery<User, Error>({
    queryKey: ["user", id],
    queryFn: async () => {
      if (!id) throw new Error("User ID is missing");
      return getUserById(Number(id));
    },
    enabled: !!id,
  });

  
  useEffect(() => {
    if (data) {
      setUser(data);
      reset(data);
    }
  }, [data, setUser, reset]);

 
  const mutation = useMutation({
    mutationFn: async ({ id, updatedData }: { id: number; updatedData: FormValues }) =>
      updateUser(id, updatedData),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      reset(updatedUser);
      queryClient.setQueryData<User[]>(["users"], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((userItem) =>
          userItem.id === updatedUser.id ? updatedUser : userItem
        );
      });
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      navigate("/users");
    },
  });

  
  const onSubmit: SubmitHandler<FormValues> = (formData) => {
    if (!id) return;
    mutation.mutate({ id: Number(id), updatedData: formData });
  };

  if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error fetching user.</Text>;

  return (
    <Box p={6}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Edit User
      </Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* First Name */}
        <FormControl mb={3} isInvalid={!!errors.firstName}>
          <FormLabel>First Name</FormLabel>
          <Input 
            {...register("firstName", { 
              required: "First Name is required", 
              minLength: { value: 2, message: "Minimum 2 characters required" }
            })} 
          />
          <FormErrorMessage>
            {errors.firstName && errors.firstName.message}
          </FormErrorMessage>
        </FormControl>

        {/* Last Name */}
        <FormControl mb={3} isInvalid={!!errors.lastName}>
          <FormLabel>Last Name</FormLabel>
          <Input 
            {...register("lastName", { required: "Last Name is required" })} 
          />
          <FormErrorMessage>
            {errors.lastName && errors.lastName.message}
          </FormErrorMessage>
        </FormControl>

        {/* Email */}
        <FormControl mb={3} isInvalid={!!errors.email}>
          <FormLabel>Email</FormLabel>
          <Input 
            type="email" 
            {...register("email", { 
              required: "Email is required", 
              pattern: { 
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, 
                message: "Invalid email address" 
              } 
            })} 
          />
          <FormErrorMessage>
            {errors.email && errors.email.message}
          </FormErrorMessage>
        </FormControl>

        {/* Gender */}
        <FormControl mb={3} isInvalid={!!errors.gender}>
          <FormLabel>Gender</FormLabel>
          <Select {...register("gender", { required: "Gender is required" })}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </Select>
          <FormErrorMessage>
            {errors.gender && errors.gender.message}
          </FormErrorMessage>
        </FormControl>

        {/* Age */}
        <FormControl mb={3} isInvalid={!!errors.age}>
          <FormLabel>Age</FormLabel>
          <Input 
            type="number" 
            {...register("age", { 
              required: "Age is required", 
              validate: value => (value >= 0 && value < 100) || "Age must be a two-digit number" 
            })} 
          />
          <FormErrorMessage>
            {errors.age && errors.age.message}
          </FormErrorMessage>
        </FormControl>

        <Button type="submit" colorScheme="blue" isLoading={mutation.isPending}>
          Update
        </Button>
      </form>
    </Box>
  );
};

export default EditUsers;
