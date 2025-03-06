
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Box, Text, Spinner, SimpleGrid, Heading, Image 
} from "@chakra-ui/react";
import { getRecipes } from "../Api/QuotesRecipes";

interface Recipe {
  id: number;
  name: string;
  description: string;
  image?: string;
}

const Recipes: React.FC = () => {
  const { data, isLoading, isError } = useQuery<Recipe[], Error>({
    queryKey: ["recipes"],
    queryFn: getRecipes,
  });

  if (isLoading) return <Spinner />;
  if (isError) return <Text>Error loading recipes.</Text>;

  return (
    <Box w="full" maxW="1200px" mx="auto" p={6}>
      <Heading 
        mb={6} 
        textAlign="center" 
        fontSize={{ base: "2xl", md: "3xl" }} 
        color="teal.500"
      >
        Recipes
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {data?.map((recipe) => (
          <Box
            key={recipe.id}
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            boxShadow="md"
            bg="white"
          >
            <Text 
              fontSize={{ base: "xl", md: "2xl" }} 
              fontWeight="bold" 
              color="teal.600"
            >
              {recipe.name}
            </Text>
            <Text mt={2} fontSize="md" color="gray.600">
              {recipe.description}
            </Text>
            {recipe.image && (
              <Image
                src={recipe.image}
                alt={recipe.name}
                mt={4}
                borderRadius="md"
                objectFit="cover"
                maxH="300px"
                w="full"
              />
            )}
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Recipes;
