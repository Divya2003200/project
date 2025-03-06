
import React from "react";
import { Box, SimpleGrid, Stat, StatLabel, Heading, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";

interface StatCardProps {
    label: string;
   
    link: string;
}

const Dashboard: React.FC = () => {
    return (
        <Flex justify="flex-start" align="center" minH="100vh" w="100%">
          <Box p={50} w="100%" maxW="900px" textAlign="center" ml="415px">  
 
                <Heading mb={6}>Admin Dashboard</Heading>
                <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6} justifyItems="center">
                    <StatCard label=" Products"  link="/products" />
                    <StatCard label=" Users"  link="/users" />
                    <StatCard label=" Orders"  link="/orders" />
                    <StatCard label=" Carts"  link="/carts" />
                    <StatCard label="Blogs and Comment Section"  link="/posts" />
                    <StatCard label="Quotes & Recipes" link="/quotes-recipes" />
                </SimpleGrid>
            </Box>
        </Flex>
    );
};

const StatCard: React.FC<StatCardProps> = ({ label, link }) => (
    <Link to={link}>
        <Box p={6} boxShadow="md" borderRadius="lg" textAlign="center" bg="gray.100" minW="200px">
            <Stat>
                <StatLabel>{label}</StatLabel>
                
            </Stat>
        </Box>
    </Link>
);

export default Dashboard;


