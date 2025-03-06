
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getOrders, Order, OrdersResponse } from "../Api/OrderApi";
import { Link } from "react-router-dom";
import { Box, Heading, Text, VStack, Spinner, Alert, AlertIcon, SimpleGrid } from "@chakra-ui/react";

const OrderList: React.FC = () => {
  const { data, isLoading, error } = useQuery<OrdersResponse>({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  if (isLoading) return <Spinner size="xl" mt={10} />;
  if (error)
    return (
      <Alert status="error" mt={4}>
        <AlertIcon />
        Error fetching orders.
      </Alert>
    );

  if (!data) return <div>No orders available.</div>;

  return (
    <VStack spacing={8} align="stretch" p={8} maxW="900px" mx="auto">
      <Heading textAlign="center" mb={4}>Order History</Heading>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={8}>
        {data.carts.map((order: Order) => (
          <Box
            key={order.id}
            p={8}
            shadow="xl"
            borderWidth="2px"
            borderRadius="lg"
            _hover={{ shadow: "2xl", transform: "scale(1.02)", transition: "0.2s" }}
            bg="white"
          >
            <Link to={`/orders/${order.id}`}>
              <Heading size="lg" mb={3}>Order #{order.id}</Heading>
              <Text fontSize="xl" mb={1}>Total: ${order.total}</Text>
              <Text fontSize="xl" mb={1}>Discounted Total: ${order.discountedTotal}</Text>
              <Text fontSize="xl" mb={1}>Total Products: {order.totalProducts}</Text>
              <Text fontSize="xl" mb={1}>Total Quantity: {order.totalQuantity}</Text>
              <Text fontSize="md" color="gray.600">User ID: {order.userId}</Text>
            </Link>
          </Box>
        ))}
      </SimpleGrid>
    </VStack>
  );
};

export default OrderList;
