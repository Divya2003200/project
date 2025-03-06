
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../Api/usersapi";
import { useParams } from "react-router-dom";
import { Box, Text, Spinner } from "@chakra-ui/react";
import { useUserStore } from "../stores/UserEditstore";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  age: number;
}

const UserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const userId = id ? Number(id) : null;
  
  // Get the updated user from Zustand, if any
  const { user: updatedUser } = useUserStore();

  // Fetch user data using React Query
  const { data: queryUser, isLoading, isError } = useQuery<User, Error>({
    queryKey: userId ? ["user", userId] : ["user"],
    queryFn: () => {
      if (!userId) throw new Error("User ID is missing");
      return getUserById(userId);
    },
    enabled: !!userId,
  });

  // Decide which data to show: the updated one from Zustand if available and matches the current user,
  // otherwise, fall back to the fetched query data.
  const user = updatedUser && updatedUser.id === userId ? updatedUser : queryUser;

  if (isLoading) return <Spinner />;
  if (isError || !user) return <Text>Error fetching user data</Text>;

  return (
    <Box p={6}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>User Details</Text>
      <Box>
        <Text><b>ID:</b> {user.id}</Text>
        <Text><b>Name:</b> {user.firstName} {user.lastName}</Text>
        <Text><b>Email:</b> {user.email}</Text>
        <Text><b>Gender:</b> {user.gender}</Text>
        <Text><b>Age:</b> {user.age}</Text>
      </Box>
    </Box>
  );
};

export default UserDetails;
