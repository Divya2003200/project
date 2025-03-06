
import React, {useEffect } from "react";
import { Box, SimpleGrid, Text, Heading,useToast } from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCarts, updateCart, removeCart} from "../Api/CartApi";
import { useCartStore } from "../stores/Cartstore";
import CartCard from '../pages/CartCard'
import NewCartForm from '../pages/NewCartForm'

// TypeScript interfaces
export interface Product {
  id: number;
  title: string;
  price: number;
  quantity: number;
  discountedTotal: number;
  thumbnail: string;
}

export interface Cart {
  id: number;
  total: number;
  discountedTotal: number;
  products: Product[];
}

 
export const recalcCartTotals = (products: Product[]): { total: number; discountedTotal: number } => {
  const total = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const discountedTotal = products.reduce((sum, p) => {
    const disc = typeof p.discountedTotal === "number" ? p.discountedTotal : p.price;
    return sum + disc * p.quantity;
  }, 0);
  return { total, discountedTotal };
};

const CartManagement: React.FC = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { cart, setCart, addItem, updateItem } = useCartStore();

  // Fetch carts from API
  const { data, isLoading } = useQuery({
    queryKey: ["carts"],
    queryFn: fetchCarts,
  });

  useEffect(() => {
    if (data) {
      setCart(data.carts);
    }
  }, [data, setCart]);

  // Update cart mutation (for updating quantities, removals, or adding items)
  const updateCartMutation = useMutation({
    mutationFn: ({
      cartId,
      products,
    }: {
      cartId: number;
      products: { id: number; quantity: number }[];
    }) => {
      if (cartId >= 100) {
        return Promise.resolve({ products });
      }
      return updateCart(cartId, products);
    },
    onSuccess: (result, { cartId, products }) => {
      const mergedProducts = products.map((up) => {
        const currentCart = cart.find((c: Cart) => c.id === cartId);
        if (currentCart) {
          const existing = currentCart.products.find((p: Product) => p.id === up.id);
          return existing ? { ...existing, ...up } : up;
        }
        return up;
      });
      const totals = recalcCartTotals(mergedProducts);
      updateItem(cartId, mergedProducts, totals);
      queryClient.invalidateQueries({ queryKey: ["carts"] });
      toast({
        title: "Cart Updated",
        description: "The cart was successfully updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update the cart.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  // Delete cart mutation
  const deleteCartMutation = useMutation({
    mutationFn: (cartId: number) => {
      if (cartId >= 100) {
        return Promise.resolve();
      }
      return removeCart(cartId);
    },
    onSuccess: (_, cartId) => {
      const newCartArray = cart.filter((c: Cart) => c.id !== cartId);
      setCart(newCartArray);
      queryClient.invalidateQueries({ queryKey: ["carts"] });
      toast({
        title: "Cart Deleted",
        description: "The cart was successfully deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete the cart.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  if (isLoading) return <Text>Loading carts...</Text>;

  return (
    <Box p={4}>
      <Heading mb={6}>Cart Management (Admin)</Heading>
      {/* New Cart Form Component */}
      <NewCartForm cart={cart} setCart={setCart} addItem={addItem} />
      {/* Display carts in a grid */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        {cart.map((c: Cart) => (
          <CartCard
            key={c.id}
            cart={c}
            updateCartMutation={updateCartMutation}
            deleteCartMutation={deleteCartMutation}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default CartManagement;
