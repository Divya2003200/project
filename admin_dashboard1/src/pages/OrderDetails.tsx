
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getOrderDetails,
  getUser,
  updateOrderStatus,
  Order,
  User,
} from "../Api/OrderApi";
import {
  Box,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  VStack,
  Button,
  Select,
  Divider,
  SimpleGrid,
  Flex,
  Stack,
  useToast,
} from "@chakra-ui/react";

const OrderDetails: React.FC = () => {
  const toast = useToast(); 
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);
  const queryClient = useQueryClient();
  const [status, setStatus] = useState("");

  const {
    data: order,
    isLoading: orderLoading,
    error: orderError,
  } = useQuery<Order>({
    queryKey: ["order", orderId],
    queryFn: () => getOrderDetails(orderId),
  });

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useQuery<User>({
    queryKey: ["user", order?.userId],
    queryFn: () => getUser(order!.userId),
    enabled: !!order,
  });

  // Mutation for updating order status
  const mutation = useMutation({
    mutationFn: (newStatus: string) => updateOrderStatus(orderId, newStatus),
    onSuccess: (_, newStatus) => {
      // Invalidate the query to refetch updated order details
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });

      // Show success toast
      toast({
        title: "Order Status Updated",
        description: `Order #${orderId} is now set to "${newStatus}".`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
    onError: () => {
      // Show error toast if something goes wrong
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  if (orderLoading || userLoading) return <Spinner size="xl" mt={10} />;
  if (orderError)
    return (
      <Alert status="error">
        <AlertIcon />
        Error fetching order details.
      </Alert>
    );
  if (userError)
    return (
      <Alert status="error">
        <AlertIcon />
        Error fetching user details.
      </Alert>
    );

  const handleStatusUpdate = () => {
    if (status.trim() === "") return;
    mutation.mutate(status);
  };

  return (
    <Box p={8} maxW="900px" mx="auto" bg="gray.50" borderRadius="md" boxShadow="lg">
      <Heading textAlign="center" mb={6}>
        Order #{order?.id}
      </Heading>

      {/* Order Summary */}
      <VStack spacing={3} mb={6} align="center">
        <Text fontSize="2xl" fontWeight="bold">Total: ${order?.total}</Text>
        <Text fontSize="lg">Discounted Total: ${order?.discountedTotal}</Text>
        <Text fontSize="lg">Products: {order?.totalProducts}</Text>
        <Text fontSize="lg">Total Quantity: {order?.totalQuantity}</Text>
      </VStack>

      <Divider my={6} />

      {/* User Details */}
      <Box mb={6} textAlign="center">
        <Heading size="md" mb={2}>User Details</Heading>
        <Text fontSize="lg">
          {user?.firstName} {user?.lastName}
        </Text>
        <Text fontSize="lg" color="gray.600">{user?.email}</Text>
      </Box>

      <Divider my={6} />

      {/* Products in Order */}
      {order?.products && order.products.length > 0 && (
        <Box mb={6}>
          <Heading size="md" mb={4} textAlign="center">
            Products in Order
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {order.products.map((product: any) => (
              <Box
                key={product.id}
                p={4}
                borderWidth="1px"
                borderRadius="md"
                bg="white"
                boxShadow="md"
              >
                <Text fontWeight="bold" fontSize="lg">
                  {product.title}
                </Text>
                <Stack direction="row" spacing={4} mt={2}>
                  <Text>Qty: {product.quantity}</Text>
                  <Text>Price: ${product.price}</Text>
                </Stack>
                <Text mt={1} color="gray.600">
                  Discounted Price: ${product.discountedPrice || product.price}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      )}

      <Divider my={6} />

      {/* Update Order Status */}
      <Box textAlign="center">
        <Heading size="md" mb={4}>
          Update Order Status
        </Heading>
        <Flex justify="center" align="center" direction={{ base: "column", md: "row" }}>
          <Select
            placeholder="Select status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            maxW="200px"
            mb={{ base: 4, md: 0 }}
            mr={{ md: 4 }}
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Select>
          <Button
            colorScheme="blue"
            onClick={handleStatusUpdate}
            isLoading={mutation.isPending}
          >
            Update Status
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default OrderDetails;
