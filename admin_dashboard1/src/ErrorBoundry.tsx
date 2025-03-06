import React, { Component, ReactNode } from "react";
import { Box, Button, Heading, Text } from "@chakra-ui/react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: undefined };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box textAlign="center" p={6} bg="red.100" borderRadius="lg" maxW="600px" mx="auto" mt="50px">
          <Heading size="lg" color="red.500">Something went wrong!</Heading>
          <Text mt={2}>{this.state.error?.message || "An unexpected error occurred."}</Text>
          <Button colorScheme="red" mt={4} onClick={this.handleReset}>
            Try Again
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
