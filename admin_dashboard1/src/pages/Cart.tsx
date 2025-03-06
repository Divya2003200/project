
// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   SimpleGrid,
//   Text,
//   Heading,
//   Image,
//   Input,
//   Button,
//   VStack,
//   HStack,
//   useToast,
// } from "@chakra-ui/react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";
// import {
//   fetchCarts,
//   addItemToCart,
//   updateCart,
//   removeCart,
// } from "../Api/CartApi";
// import { useCartStore } from "../stores/Cartstore";

// // TypeScript interfaces
// interface Product {
//   id: number;
//   title: string;
//   price: number;
//   quantity: number;
//   discountedTotal: number;
//   thumbnail: string;
// }

// interface Cart {
//   id: number;
//   total: number;
//   discountedTotal: number;
//   products: Product[];
// }

// // Helper: Recalculate totals for a cart based on its products.
// const recalcCartTotals = (products: Product[]): { total: number; discountedTotal: number } => {
//   const total = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
//   const discountedTotal = products.reduce((sum, p) => sum + p.discountedTotal * p.quantity, 0);
//   return { total, discountedTotal };
// };

// const CartManagement: React.FC = () => {
//   const toast = useToast();
//   const queryClient = useQueryClient();
//   const { cart, setCart, addItem, updateItem } = useCartStore();

//   // State for creating a new cart
//   const [newUserId, setNewUserId] = useState<string>("");
//   const [newProductId, setNewProductId] = useState<string>("");
//   const [newQuantity, setNewQuantity] = useState<string>("");

//   // Local state for updated quantities (keyed by product id)
//   const [updatedQuantities, setUpdatedQuantities] = useState<{ [key: number]: number }>({});

//   // Local state for new item inputs per cart (keyed by cart id)
//   const [newItemInputs, setNewItemInputs] = useState<{ [key: number]: { productId: string; quantity: string } }>({});

//   // Fetch carts from API
//   const { data, isLoading } = useQuery({
//     queryKey: ["carts"],
//     queryFn: fetchCarts,
//   });

//   useEffect(() => {
//     if (data) {
//       setCart(data.carts);
//     }
//   }, [data, setCart]);

//   // Create a new cart via API
//   const addCartMutation = useMutation({
//     mutationFn: () =>
//       addItemToCart({
//         userId: Number(newUserId),
//         products: [{ id: Number(newProductId), quantity: Number(newQuantity) }],
//       }),
//     onSuccess: (newCart) => {
//       // API may return duplicate ID; override for uniqueness.
//       if (newCart.id === 51) {
//         newCart.id = Math.floor(Math.random() * 1000) + 100;
//       }
//       // Recalculate totals in case API doesn't do it properly.
//       const totals = recalcCartTotals(newCart.products);
//       const cartWithTotals = { ...newCart, ...totals };
//       addItem(cartWithTotals);
//       setCart([...cart, cartWithTotals]);
//       queryClient.invalidateQueries({ queryKey: ["carts"] });
//       toast({
//         title: "Cart Created",
//         description: "A new cart has been created.",
//         status: "success",
//         duration: 3000,
//         isClosable: true,
//       });
//       setNewUserId("");
//       setNewProductId("");
//       setNewQuantity("");
//     },
//     onError: () => {
//       toast({
//         title: "Error",
//         description: "Failed to create a new cart.",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//     },
//   });

//   // Update cart mutation (for updating quantities, removals, or adding items)
//   const updateCartMutation = useMutation({
//     mutationFn: ({
//       cartId,
//       products,
//     }: {
//       cartId: number;
//       products: { id: number; quantity: number }[];
//     }) => {
//       if (cartId >= 100) {
//         return Promise.resolve({ products });
//       }
//       return updateCart(cartId, products);
//     },
//     onSuccess: (result, { cartId, products }) => {
//       // Merge updated product info with existing details.
//       const newCartArray = cart.map((c: Cart) => {
//         if (c.id === cartId) {
//           // For each product in updated list, merge with existing details.
//           const mergedProducts = products.map((up) => {
//             const existing = c.products.find((p: Product) => p.id === up.id);
//             return existing ? { ...existing, ...up } : up;
//           });
//           const totals = recalcCartTotals(mergedProducts as Product[]);
//           return { ...c, products: mergedProducts, ...totals };
//         }
//         return c;
//       });
//       setCart(newCartArray);
//       queryClient.invalidateQueries({ queryKey: ["carts"] });
//       toast({
//         title: "Cart Updated",
//         description: "The cart was successfully updated.",
//         status: "success",
//         duration: 3000,
//         isClosable: true,
//       });
//     },
//     onError: () => {
//       toast({
//         title: "Error",
//         description: "Failed to update the cart.",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//     },
//   });

//   // Delete cart mutation
//   const deleteCartMutation = useMutation({
//     mutationFn: (cartId: number) => {
//       if (cartId >= 100) {
//         return Promise.resolve();
//       }
//       return removeCart(cartId);
//     },
//     onSuccess: (_, cartId) => {
//       const newCartArray = cart.filter((c: Cart) => c.id !== cartId);
//       setCart(newCartArray);
//       queryClient.invalidateQueries({ queryKey: ["carts"] });
//       toast({
//         title: "Cart Deleted",
//         description: "The cart was successfully deleted.",
//         status: "success",
//         duration: 3000,
//         isClosable: true,
//       });
//     },
//     onError: () => {
//       toast({
//         title: "Error",
//         description: "Failed to delete the cart.",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//     },
//   });

//   // Handler for adding a new item to an existing cart
//   const handleAddItem = async (cartId: number) => {
//     const inputs = newItemInputs[cartId];
//     if (!inputs || !inputs.productId || !inputs.quantity) {
//       toast({
//         title: "Input Required",
//         description: "Please enter product ID and quantity.",
//         status: "warning",
//         duration: 3000,
//         isClosable: true,
//       });
//       return;
//     }
//     const prodId = Number(inputs.productId);
//     const qtyToAdd = Number(inputs.quantity);
//     const currentCart = cart.find((c: Cart) => c.id === cartId);
//     if (!currentCart) return;
//     const existingProduct = currentCart.products.find((p: Product) => p.id === prodId);
//     let newProducts;
//     if (existingProduct) {
//       // Increase quantity if product exists.
//       newProducts = currentCart.products.map((p: Product) =>
//         p.id === prodId ? { id: p.id, quantity: p.quantity + qtyToAdd } : { id: p.id, quantity: p.quantity }
//       );
//       // Update UI details using the existing product details.
//       updateCartMutation.mutate({ cartId, products: newProducts });
//     } else {
//       // Fetch product details from DummyJSON API.
//       try {
//         const res = await axios.get(`https://dummyjson.com/products/${prodId}`);
//         const prodDetails = res.data;
//         const newProduct: Product = {
//           id: prodDetails.id,
//           title: prodDetails.title,
//           price: prodDetails.price,
//           quantity: qtyToAdd,
//           discountedTotal: prodDetails.discountedPrice || prodDetails.price,
//           thumbnail: prodDetails.thumbnail,
//         };
//         newProducts = [
//           ...currentCart.products.map((p: Product) => ({ id: p.id, quantity: p.quantity })),
//           { id: newProduct.id, quantity: newProduct.quantity },
//         ];
//         // Update UI to include full product details.
//         const newCartArray = cart.map((c: Cart) =>
//           c.id === cartId ? { ...c, products: [...c.products, newProduct] } : c
//         );
//         setCart(newCartArray);
//         updateCartMutation.mutate({ cartId, products: newProducts });
//       } catch (error) {
//         toast({
//           title: "Error",
//           description: "Failed to fetch product details.",
//           status: "error",
//           duration: 3000,
//           isClosable: true,
//         });
//       }
//     }
//     // Clear new item inputs for this cart.
//     setNewItemInputs((prev) => ({ ...prev, [cartId]: { productId: "", quantity: "" } }));
//   };

//   if (isLoading) return <Text>Loading carts...</Text>;

//   return (
//     <Box p={4}>
//       <Heading mb={6}>Cart Management (Admin)</Heading>

//       {/* New Cart Form */}
//       <Box borderWidth="1px" borderRadius="lg" p={4} mb={8}>
//         <Heading as="h3" size="md" mb={4}>
//           Create New Cart
//         </Heading>
//         <Input
//           type="number"
//           value={newUserId}
//           onChange={(e) => setNewUserId(e.target.value)}
//           placeholder="Enter User ID"
//           mb={2}
//         />
//         <Input
//           type="number"
//           value={newProductId}
//           onChange={(e) => setNewProductId(e.target.value)}
//           placeholder="Enter Product ID"
//           mb={2}
//         />
//         <Input
//           type="number"
//           value={newQuantity}
//           onChange={(e) => setNewQuantity(e.target.value)}
//           placeholder="Enter Quantity"
//           mb={2}
//         />
//         <Button colorScheme="blue" onClick={() => addCartMutation.mutate()}>
//           Create Cart
//         </Button>
//       </Box>

//       {/* Display carts in a grid */}
//       <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
//         {cart.map((c: Cart) => (
//           <Box key={c.id} borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} boxShadow="md">
//             <HStack justifyContent="space-between" mb={2}>
//               <Heading as="h4" size="sm">
//                 Cart {c.id}
//               </Heading>
//               <Button colorScheme="red" size="xs" onClick={() => deleteCartMutation.mutate(c.id)}>
//                 Delete Cart
//               </Button>
//             </HStack>
//             <Text>
//               <strong>Total:</strong> ${c.total}
//             </Text>
//             <Text mb={2}>
//               <strong>Discounted Total:</strong> ${c.discountedTotal}
//             </Text>
//             <Text fontWeight="bold" mt={2} mb={1}>
//               Products:
//             </Text>
//             <VStack spacing={3} align="stretch">
//               {c.products.map((product: Product) => (
//                 <HStack key={product.id} spacing={3} align="center" borderWidth="1px" borderRadius="md" p={2}>
//                   <Image src={product.thumbnail} alt={product.title} boxSize="50px" objectFit="cover" borderRadius="md" />
//                   <Box flex="1">
//                     <Text fontWeight="bold">{product.title}</Text>
//                     <Text fontSize="sm">Price: ${product.price}</Text>
//                     <Text fontSize="sm">Current Qty: {product.quantity}</Text>
//                     <Text fontSize="sm">Discounted Total: ${product.discountedTotal}</Text>
//                   </Box>
//                   <Input
//                     size="xs"
//                     width="60px"
//                     type="number"
//                     placeholder="Qty"
//                     value={updatedQuantities[product.id] ?? product.quantity}
//                     onChange={(e) =>
//                       setUpdatedQuantities((prev) => ({
//                         ...prev,
//                         [product.id]: Number(e.target.value),
//                       }))
//                     }
//                   />
//                   <Button
//                     colorScheme="blue"
//                     size="xs"
//                     onClick={() => {
//                       const newProducts = c.products.map((p) =>
//                         p.id === product.id
//                           ? { id: p.id, quantity: updatedQuantities[product.id] ?? p.quantity }
//                           : { id: p.id, quantity: p.quantity }
//                       );
//                       updateCartMutation.mutate({ cartId: c.id, products: newProducts });
//                     }}
//                   >
//                     Update
//                   </Button>
//                   <Button
//                     colorScheme="red"
//                     size="xs"
//                     onClick={() => {
//                       const newProducts = c.products
//                         .filter((p) => p.id !== product.id)
//                         .map((p) => ({ id: p.id, quantity: p.quantity }));
//                       updateCartMutation.mutate({ cartId: c.id, products: newProducts });
//                     }}
//                   >
//                     Remove
//                   </Button>
//                 </HStack>
//               ))}
//               {/* Add new item form for this cart */}
//               <HStack spacing={3} align="center">
//                 <Input
//                   size="xs"
//                   width="80px"
//                   type="number"
//                   placeholder="Prod ID"
//                   value={newItemInputs[c.id]?.productId || ""}
//                   onChange={(e) =>
//                     setNewItemInputs((prev) => ({
//                       ...prev,
//                       [c.id]: { ...prev[c.id], productId: e.target.value },
//                     }))
//                   }
//                 />
//                 <Input
//                   size="xs"
//                   width="60px"
//                   type="number"
//                   placeholder="Qty"
//                   value={newItemInputs[c.id]?.quantity || ""}
//                   onChange={(e) =>
//                     setNewItemInputs((prev) => ({
//                       ...prev,
//                       [c.id]: { ...prev[c.id], quantity: e.target.value },
//                     }))
//                   }
//                 />
//                 <Button colorScheme="green" size="xs" onClick={() => handleAddItem(c.id)}>
//                   Add Item
//                 </Button>
//               </HStack>
//             </VStack>
//           </Box>
//         ))}
//       </SimpleGrid>
//     </Box>
//   );
// };

// export default CartManagement;
import React, { useState, useEffect } from "react";
import {
  Box,
  SimpleGrid,
  Text,
  Heading,
  Image,
  Input,
  Button,
  VStack,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  fetchCarts,
  addItemToCart,
  updateCart,
  removeCart,
} from "../Api/CartApi";
import { useCartStore } from "../stores/Cartstore";

// TypeScript interfaces
interface Product {
  id: number;
  title: string;
  price: number;
  quantity: number;
  discountedTotal: number;
  thumbnail: string;
}

interface Cart {
  id: number;
  total: number;
  discountedTotal: number;
  products: Product[];
}

// Helper: Recalculate totals for a cart based on its products.
const recalcCartTotals = (products: Product[]): { total: number; discountedTotal: number } => {
  const total = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const discountedTotal = products.reduce((sum, p) => {
    // Use p.discountedTotal if defined; otherwise fallback to p.price.
    const disc = typeof p.discountedTotal === "number" ? p.discountedTotal : p.price;
    return sum + disc * p.quantity;
  }, 0);
  return { total, discountedTotal };
};

const CartManagement: React.FC = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { cart, setCart, addItem, updateItem } = useCartStore();

  // State for creating a new cart
  const [newUserId, setNewUserId] = useState<string>("");
  const [newProductId, setNewProductId] = useState<string>("");
  const [newQuantity, setNewQuantity] = useState<string>("");

  // Local state for updated quantities (keyed by product id)
  const [updatedQuantities, setUpdatedQuantities] = useState<{ [key: number]: number }>({});
  // Local state for new item inputs per cart (keyed by cart id)
  const [newItemInputs, setNewItemInputs] = useState<{ [key: number]: { productId: string; quantity: string } }>({});

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

  // Create a new cart via API
  const addCartMutation = useMutation({
    mutationFn: () =>
      addItemToCart({
        userId: Number(newUserId),
        products: [{ id: Number(newProductId), quantity: Number(newQuantity) }],
      }),
    onSuccess: (newCart) => {
      // API may return duplicate ID (e.g., 51); override for uniqueness.
      if (newCart.id === 51) {
        newCart.id = Math.floor(Math.random() * 1000) + 100;
      }
      // Recalculate totals in case API doesn't do it properly.
      const totals = recalcCartTotals(newCart.products);
      const cartWithTotals = { ...newCart, ...totals };
      addItem(cartWithTotals);
      setCart([...cart, cartWithTotals]);
      queryClient.invalidateQueries({ queryKey: ["carts"] });
      toast({
        title: "Cart Created",
        description: "A new cart has been created.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setNewUserId("");
      setNewProductId("");
      setNewQuantity("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create a new cart.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

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
      const totals = recalcCartTotals(mergedProducts as Product[]);
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
    const currentCart = cart.find((c: Cart) => c.id === cartId);
    if (!currentCart) return;
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
        newProducts = [
          ...currentCart.products.map((p: Product) => ({ id: p.id, quantity: p.quantity })),
          { id: newProduct.id, quantity: newProduct.quantity },
        ];
        // Update UI to include full product details.
        const newCartArray = cart.map((c: Cart) =>
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

  if (isLoading) return <Text>Loading carts...</Text>;

  return (
    <Box p={4}>
      <Heading mb={6}>Cart Management (Admin)</Heading>

      {/* New Cart Form */}
      <Box borderWidth="1px" borderRadius="lg" p={4} mb={8}>
        <Heading as="h3" size="md" mb={4}>
          Create New Cart
        </Heading>
        <Input
          type="number"
          value={newUserId}
          onChange={(e) => setNewUserId(e.target.value)}
          placeholder="Enter User ID"
          mb={2}
        />
        <Input
          type="number"
          value={newProductId}
          onChange={(e) => setNewProductId(e.target.value)}
          placeholder="Enter Product ID"
          mb={2}
        />
        <Input
          type="number"
          value={newQuantity}
          onChange={(e) => setNewQuantity(e.target.value)}
          placeholder="Enter Quantity"
          mb={2}
        />
        <Button colorScheme="blue" onClick={() => addCartMutation.mutate()}>
          Create Cart
        </Button>
      </Box>

      {/* Display carts in a grid */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        {cart.map((c: Cart) => (
          <Box key={c.id} borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} boxShadow="md">
            <HStack justifyContent="space-between" mb={2}>
              <Heading as="h4" size="sm">
                Cart {c.id}
              </Heading>
              <Button colorScheme="red" size="xs" onClick={() => deleteCartMutation.mutate(c.id)}>
                Delete Cart
              </Button>
            </HStack>
            <Text>
              <strong>Total:</strong> ${c.total}
            </Text>
            <Text mb={2}>
              <strong>Discounted Total:</strong> ${c.discountedTotal}
            </Text>
            <Text fontWeight="bold" mt={2} mb={1}>
              Products:
            </Text>
            <VStack spacing={3} align="stretch">
              {c.products.map((product: Product) => (
                <HStack key={product.id} spacing={3} align="center" borderWidth="1px" borderRadius="md" p={2}>
                  <Image src={product.thumbnail} alt={product.title} boxSize="50px" objectFit="cover" borderRadius="md" />
                  <Box flex="1">
                    <Text fontWeight="bold">{product.title}</Text>
                    <Text fontSize="sm">Price: ${product.price}</Text>
                    <Text fontSize="sm">Current Qty: {product.quantity}</Text>
                    <Text fontSize="sm">Discounted Total: ${product.discountedTotal}</Text>
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
                      const newProducts = c.products.map((p) =>
                        p.id === product.id
                          ? { id: p.id, quantity: updatedQuantities[product.id] ?? p.quantity }
                          : { id: p.id, quantity: p.quantity }
                      );
                      updateCartMutation.mutate({ cartId: c.id, products: newProducts });
                    }}
                  >
                    Update
                  </Button>
                  <Button
                    colorScheme="red"
                    size="xs"
                    onClick={() => {
                      const newProducts = c.products
                        .filter((p) => p.id !== product.id)
                        .map((p) => ({ id: p.id, quantity: p.quantity }));
                      updateCartMutation.mutate({ cartId: c.id, products: newProducts });
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
                  value={newItemInputs[c.id]?.productId || ""}
                  onChange={(e) =>
                    setNewItemInputs((prev) => ({
                      ...prev,
                      [c.id]: { ...prev[c.id], productId: e.target.value },
                    }))
                  }
                />
                <Input
                  size="xs"
                  width="60px"
                  type="number"
                  placeholder="Qty"
                  value={newItemInputs[c.id]?.quantity || ""}
                  onChange={(e) =>
                    setNewItemInputs((prev) => ({
                      ...prev,
                      [c.id]: { ...prev[c.id], quantity: e.target.value },
                    }))
                  }
                />
                <Button colorScheme="green" size="xs" onClick={() => handleAddItem(c.id)}>
                  Add Item
                </Button>
              </HStack>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default CartManagement;
