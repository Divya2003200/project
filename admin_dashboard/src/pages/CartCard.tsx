
import React, { useState } from "react";
import { Box, Heading, Text, HStack, VStack, Input, Button, Image, useToast } from "@chakra-ui/react";
import axios from "axios";
import { UseMutationResult } from "@tanstack/react-query";
import { Cart, Product } from './Cart'
import { useCartStore } from "../stores/Cartstore"; // using your zustand store

interface CartCardProps {
  cart: Cart;
  updateCartMutation: UseMutationResult<
    any,
    unknown,
    { cartId: number; products: { id: number; quantity: number; discountedTotal?: number }[] }
  >;
  deleteCartMutation: UseMutationResult<any, unknown, number>;
}

const CartCard: React.FC<CartCardProps> = ({ cart, updateCartMutation, deleteCartMutation }) => {
  const [updatedQuantities, setUpdatedQuantities] = useState<{ [key: number]: number }>({});
  const [newItemInputs, setNewItemInputs] = useState<{ [key: number]: { productId: string; quantity: string } }>({});
  const toast = useToast();
  const { cart: globalCart, setCart } = useCartStore();

  // Handler for adding a new item to an existing cart
  const handleAddItem = async (cartId: number) => {
    const inputs = newItemInputs[cartId];
    if (!inputs || !inputs.productId || !inputs.quantity) {
      toast({
        title: "Input Required",
        description: "Please enter product ID and quantity.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const prodId = Number(inputs.productId);
    const qtyToAdd = Number(inputs.quantity);
    const currentCart = cart;
    const existingProduct = currentCart.products.find((p: Product) => p.id === prodId);
    let newProducts;
    if (existingProduct) {
      // Increase quantity if product exists.
      newProducts = currentCart.products.map((p: Product) =>
        p.id === prodId ? { id: p.id, quantity: p.quantity + qtyToAdd } : { id: p.id, quantity: p.quantity }
      );
      updateCartMutation.mutate({ cartId, products: newProducts });
    } else {
      try {
        const res = await axios.get(`https://dummyjson.com/products/${prodId}`);
        const prodDetails = res.data;
        const newProduct: Product = {
          id: prodDetails.id,
          title: prodDetails.title,
          price: prodDetails.price,
          quantity: qtyToAdd,
          discountedTotal: prodDetails.discountedPrice || prodDetails.price,
          thumbnail: prodDetails.thumbnail,
        };
        // Build payload including discountedTotal for the update mutation.
        newProducts = [
          ...currentCart.products.map((p: Product) => ({
            id: p.id,
            quantity: p.quantity,
          })),
          { id: newProduct.id, quantity: newProduct.quantity, discountedTotal: newProduct.discountedTotal },
        ];
        // Update global state with full product details.
        const newCartArray = globalCart.map((c: Cart) =>
          c.id === cartId ? { ...c, products: [...c.products, newProduct] } : c
        );
        setCart(newCartArray);
        updateCartMutation.mutate({ cartId, products: newProducts });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch product details.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
    setNewItemInputs((prev) => ({ ...prev, [cartId]: { productId: "", quantity: "" } }));
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} boxShadow="md">
      <HStack justifyContent="space-between" mb={2}>
        <Heading as="h4" size="sm">
          Cart {cart.id}
        </Heading>
        <Button colorScheme="red" size="xs" onClick={() => deleteCartMutation.mutate(cart.id)}>
          Delete Cart
        </Button>
      </HStack>
      <Text>
        <strong>Total:</strong> ${cart.total}
      </Text>
      <Text mb={2}>
        <strong>Discounted Total:</strong> ${cart.discountedTotal}
      </Text>
      <Text fontWeight="bold" mt={2} mb={1}>
        Products:
      </Text>
      <VStack spacing={3} align="stretch">
        {cart.products.map((product: Product) => (
          <HStack key={product.id} spacing={3} align="center" borderWidth="1px" borderRadius="md" p={2}>
            <Image src={product.thumbnail} alt={product.title} boxSize="50px" objectFit="cover" borderRadius="md" />
            <Box flex="1">
              <Text fontWeight="bold">{product.title}</Text>
              <Text fontSize="sm">Price: ${product.price* product.quantity}</Text>
              <Text fontSize="sm">Current Qty: {product.quantity}</Text>
              <Text fontSize="sm">Discounted Total: ${product.discountedTotal *product.quantity}</Text>
            </Box>
            <Input
              size="xs"
              width="60px"
              type="number"
              placeholder="Qty"
              value={updatedQuantities[product.id] ?? product.quantity}
              onChange={(e) =>
                setUpdatedQuantities((prev) => ({
                  ...prev,
                  [product.id]: Number(e.target.value),
                }))
              }
            />
            <Button
              colorScheme="blue"
              size="xs"
              onClick={() => {
                const newProducts = cart.products.map((p) =>
                  p.id === product.id
                    ? { id: p.id, quantity: updatedQuantities[product.id] ?? p.quantity }
                    : { id: p.id, quantity: p.quantity }
                );
                updateCartMutation.mutate({ cartId: cart.id, products: newProducts });
              }}
            >
              Update
            </Button>
            <Button
              colorScheme="red"
              size="xs"
              onClick={() => {
                const newProducts = cart.products
                  .filter((p) => p.id !== product.id)
                  .map((p) => ({ id: p.id, quantity: p.quantity }));
                updateCartMutation.mutate({ cartId: cart.id, products: newProducts });
              }}
            >
              Remove
            </Button>
          </HStack>
        ))}
        {/* Add new item form for this cart */}
        <HStack spacing={3} align="center">
          <Input
            size="xs"
            width="80px"
            type="number"
            placeholder="Prod ID"
            value={newItemInputs[cart.id]?.productId || ""}
            onChange={(e) =>
              setNewItemInputs((prev) => ({
                ...prev,
                [cart.id]: { ...prev[cart.id], productId: e.target.value },
              }))
            }
          />
          <Input
            size="xs"
            width="60px"
            type="number"
            placeholder="Qty"
            value={newItemInputs[cart.id]?.quantity || ""}
            onChange={(e) =>
              setNewItemInputs((prev) => ({
                ...prev,
                [cart.id]: { ...prev[cart.id], quantity: e.target.value },
              }))
            }
          />
          <Button colorScheme="green" size="xs" onClick={() => handleAddItem(cart.id)}>
            Add Item
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default CartCard;
