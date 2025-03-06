
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../Api/BlofCommentapi";
import { Link } from "react-router-dom";
import { Box, Heading, Text, VStack, Spinner, Alert, AlertIcon } from "@chakra-ui/react";

const PostList: React.FC = () => {
  const { data, isLoading, error } = useQuery({ queryKey: ["posts"], queryFn: getPosts });

  if (isLoading) return <Spinner size="xl" mt={10} />;
  if (error) return (
    <Alert status="error" mt={4}>
      <AlertIcon />
      Error fetching posts
    </Alert>
  );

  return (
    <VStack spacing={6} align="stretch" p={5} maxW="800px" mx="auto">
      <Heading textAlign="center">Blogs & Comments</Heading>

      {data.posts.map((post: any) => (
        <Box 
          key={post.id} 
          p={5} 
          shadow="md" 
          borderWidth="1px" 
          borderRadius="lg" 
          _hover={{ shadow: "lg", transform: "scale(1.02)", transition: "0.2s" }}
        >
          <Heading size="md">
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
          </Heading>
          <Text mt={2} noOfLines={2}>{post.body}</Text>
        </Box>
      ))}
    </VStack>
  );
};

export default PostList;
