
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPostDetails, getComments } from "../Api/BlofCommentapi";
import AddComment from "../pages/AddComment";
import { useCommentStore } from "../stores/BlogCommentstore";
import { Box, Heading, Text, VStack, Spinner, Divider } from "@chakra-ui/react";

const PostDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: post, isLoading: postLoading } = useQuery({ queryKey: ["post", id], queryFn: () => getPostDetails(id!) });
  const { data: comments, isLoading: commentsLoading } = useQuery({ queryKey: ["comments"], queryFn: getComments });
  const { comments: storeComments } = useCommentStore();

  if (postLoading || commentsLoading) return <Spinner size="xl" mt={10} />;

  return (
    <Box p={5} maxW="800px" mx="auto">
      <Heading mb={3}>{post.title}</Heading>
      <Text fontSize="lg" mb={5}>{post.body}</Text>
      
      <Divider my={4} />

      <Heading size="md" mb={3}>Comments</Heading>
      <VStack align="stretch" spacing={4}>
        {[...comments.comments, ...storeComments].map((comment: any) => (
          <Box key={comment.id} p={4} shadow="md" borderWidth="1px" borderRadius="md" bg="gray.50">
            <Text>{comment.body}</Text>
          </Box>
        ))}
      </VStack>

      <Divider my={4} />
      
      <AddComment postId={post.id} />
    </Box>
  );
};

export default PostDetails;
