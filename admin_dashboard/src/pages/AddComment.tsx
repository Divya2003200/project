
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { addComment } from "../Api/BlofCommentapi";
import { useCommentStore } from "../stores/BlogCommentstore";
import { Box, Button, Input, VStack } from "@chakra-ui/react";

interface AddCommentProps {
  postId: number;
}

const AddComment: React.FC<AddCommentProps> = ({ postId }) => {
  const [comment, setComment] = useState("");
  const { addComment: addToStore } = useCommentStore();
  const mutation = useMutation({ mutationFn: addComment, onSuccess: (newComment) => addToStore(newComment) });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim() === "") return;
    mutation.mutate({ postId, body: comment, userId: 1 });
    setComment("");
  };

  return (
    <Box as="form" onSubmit={handleSubmit} p={4} shadow="md" borderWidth="1px" borderRadius="md" bg="gray.100">
      <VStack spacing={3}>
        <Input 
          value={comment} 
          onChange={(e) => setComment(e.target.value)} 
          placeholder="Write your comment..." 
          size="lg" 
          bg="white" 
        />
        <Button type="submit" colorScheme="blue" width="full" isDisabled={mutation.isPending}>
        {mutation.isPending ? "Submitting..." : "Submit Comment"}
        </Button>

      </VStack>
    </Box>
  );
};

export default AddComment;
