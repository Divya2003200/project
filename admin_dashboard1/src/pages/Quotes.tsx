


// import React from "react";
// import { useQuery } from "@tanstack/react-query";
// import { Box, Text, Spinner, Heading, VStack } from "@chakra-ui/react";
// import { getAllQuotes } from "../Api/QuotesRecipes";

// interface Quote {
//   id: number;
//   quote: string;
//   author: string;
// }

// const Quotes: React.FC = () => {
//   const { data, isLoading, isError } = useQuery<Quote[], Error>({
//     queryKey: ["quotes"],
//     queryFn: getAllQuotes,
//   });

//   if (isLoading) return <Spinner />;
//   if (isError) return <Text>Error loading quotes.</Text>;

//   return (
//     <Box p={6}>
//       <Heading mb={4}>Motivational Quotes</Heading>
//       <VStack spacing={4} align="stretch">
//         {data?.map((quote) => (
//           <Box key={quote.id} p={4} borderWidth="1px" borderRadius="lg">
//             <Text fontSize="lg">"{quote.quote}"</Text>
//             <Text mt={2} fontStyle="italic">- {quote.author}</Text>
//           </Box>
//         ))}
//       </VStack>
//     </Box>
//   );
// };

// export default Quotes;
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, Text, Spinner, Heading, VStack } from "@chakra-ui/react";
import { getAllQuotes } from "../Api/QuotesRecipes";

interface Quote {
  id: number;
  quote: string;
  author: string;
}

const Quotes: React.FC = () => {
  const { data, isLoading, isError } = useQuery<Quote[], Error>({
    queryKey: ["quotes"],
    queryFn: getAllQuotes,
  });

  if (isLoading) return <Spinner />;
  if (isError) return <Text>Error loading quotes.</Text>;

  return (
    <Box p={6}>
      <Heading mb={4}>Motivational Quotes</Heading>
      <VStack spacing={4} align="stretch">
        {data?.map((quote) => (
          <Box key={quote.id} p={4} borderWidth="1px" borderRadius="lg">
            <Text fontSize="lg" mt={3} fontStyle="italic">"{quote.quote}"</Text>
            <Text mt={2} fontStyle="italic">- {quote.author}</Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default Quotes;
