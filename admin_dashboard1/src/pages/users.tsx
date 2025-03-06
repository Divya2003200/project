
// import React, { useState } from "react";
// import { useQuery, useMutation } from "@tanstack/react-query";
// import { getAllUsers, searchUserById, filterUsersByGender } from "../Api/usersapi";
// import { Box, Input, Button, Table, Thead, Tbody, Tr, Th, Td, Select, Text, Link } from "@chakra-ui/react";
// import { Link as RouterLink } from "react-router-dom";

// interface User {
//     id: number;
//     firstName: string;
//     lastName: string;
//     email: string;
//     gender: string;
//     age: number;
// }

// const Users: React.FC = () => {
//     const [searchId, setSearchId] = useState<string>("");
//     const [genderFilter, setGenderFilter] = useState<string>("");
//     const [filteredUsers, setFilteredUsers] = useState<User[] | undefined>(undefined);

//     // ✅ Fetch all users
//     const { data: users, refetch, isLoading } = useQuery<User[], Error>({
//         queryKey: ["users"],
//         queryFn: getAllUsers,
//     });

//     // ✅ Search user by ID
//     const searchMutation = useMutation<User | null, Error, number>({
//         mutationFn: searchUserById,
//         onSuccess: (data) => {
//             setFilteredUsers(data ? [data] : []);
//         },
//     });

//     // ✅ Filter users by gender
//     const filterMutation = useMutation<User[], Error, string>({
//         mutationFn: filterUsersByGender,
//         onSuccess: (data) => {
//             console.log("Filtered Users:", data);
//             setFilteredUsers(Array.isArray(data) ? [...data] : []);
//         },
//         onError: (error) => {
//             console.error("Error filtering users:", error);
//             setFilteredUsers([]);
//         },
//     });

//     // ✅ Handle Search
//     const handleSearch = () => {
//         if (searchId) {
//             searchMutation.mutate(parseInt(searchId));
//             setGenderFilter(""); // Reset filter
//         } else {
//             setFilteredUsers(undefined);
//             refetch();
//         }
//     };

//     // ✅ Handle Filtering
//     const handleFilter = (gender: string) => {
//         setGenderFilter(gender);
//         setSearchId(""); // Reset search input

//         if (gender) {
//             filterMutation.mutate(gender);
//         } else {
//             setFilteredUsers(users ?? []); // Reset to all users
//         }
//     };

//     // ✅ Users to display (filtered or all)
//     const displayedUsers = filteredUsers !== undefined ? filteredUsers : users;

//     console.log("Displayed Users:", displayedUsers);

//     return (
//         <Box p={6}>
//             <Text fontSize="2xl" fontWeight="bold" mb={4}>Users Management</Text>

//             {/* Loading State */}
//             {isLoading && <Text>Loading users...</Text>}

//             {/* Search & Filter */}
//             <Box display="flex" gap={4} mb={4}>
//                 <Input 
//                     placeholder="Search by ID" 
//                     value={searchId} 
//                     onChange={(e) => setSearchId(e.target.value)} 
//                 />
//                 <Button onClick={handleSearch}>Search</Button>
//                 <Select 
//                     placeholder="Filter by Gender" 
//                     value={genderFilter} 
//                     onChange={(e) => handleFilter(e.target.value)}
//                 >
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                 </Select>
//             </Box>

//             {/* Users Table */}
//             {displayedUsers && displayedUsers.length > 0 ? (
//                 <Table variant="simple">
//                     <Thead>
//                         <Tr>
//                             <Th>ID</Th>
//                             <Th>Name</Th>
//                             <Th>Email</Th>
//                             <Th>Gender</Th>
//                             <Th>Age</Th>
//                             <Th>View</Th>
//                             <Th>Edit</Th>
//                         </Tr>
//                     </Thead>
//                     <Tbody>
//                         {displayedUsers.map((user: User) => (
//                             <Tr key={user.id}>
//                                 <Td>{user.id}</Td>
//                                 <Td>{user.firstName} {user.lastName}</Td>
//                                 <Td>{user.email}</Td>
//                                 <Td>{user.gender}</Td>
//                                 <Td>{user.age}</Td>
//                                 <Td>
//                                     <Link as={RouterLink} to={`/users/${user.id}`} color="blue.500">
//                                         View Details
//                                     </Link>
//                                 </Td>
//                                 <Td>
//                                     <Link as={RouterLink} to={`/editusers/${user.id}`} color="green.500">
//                                         Edit
//                                     </Link>
//                                 </Td>
//                             </Tr>
//                         ))}
//                     </Tbody>
//                 </Table>
//             ) : (
//                 <Text>No users found.</Text>
//             )}
//         </Box>
//     );
// };

// export default Users;

import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllUsers, searchUserById, filterUsersByGender } from "../Api/usersapi";
import { Box, Input, Button, Table, Thead, Tbody, Tr, Th, Td, Select, Text, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  age: number;
}

const Users: React.FC = () => {
  const [searchId, setSearchId] = useState<string>("");
  const [genderFilter, setGenderFilter] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<User[] | undefined>(undefined);

  // Fetch all users with a high staleTime (so it doesn’t refetch and overwrite the cache)
  const { data: users, refetch, isLoading } = useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: getAllUsers,
    staleTime: Infinity, // Keep the local cache indefinitely
  });

  // Search user by ID
  const searchMutation = useMutation<User | null, Error, number>({
    mutationFn: searchUserById,
    onSuccess: (data) => {
      setFilteredUsers(data ? [data] : []);
    },
  });

  // Filter users by gender
  const filterMutation = useMutation<User[], Error, string>({
    mutationFn: filterUsersByGender,
    onSuccess: (data) => {
      setFilteredUsers(Array.isArray(data) ? [...data] : []);
    },
    onError: (error) => {
      console.error("Error filtering users:", error);
      setFilteredUsers([]);
    },
  });

  // Handle Search
  const handleSearch = () => {
    if (searchId) {
      searchMutation.mutate(parseInt(searchId));
      setGenderFilter(""); // Reset filter
    } else {
      setFilteredUsers(undefined);
      refetch();
    }
  };

  // Handle Filtering
  const handleFilter = (gender: string) => {
    setGenderFilter(gender);
    setSearchId(""); // Reset search input

    if (gender) {
      filterMutation.mutate(gender);
    } else {
      setFilteredUsers(users ?? []); // Reset to all users
    }
  };

  // Users to display (filtered or all)
  const displayedUsers = filteredUsers !== undefined ? filteredUsers : users;

  return (
    <Box p={6}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>Users Management</Text>
      {isLoading && <Text>Loading users...</Text>}
      <Box display="flex" gap={4} mb={4}>
        <Input 
          placeholder="Search by ID" 
          value={searchId} 
          onChange={(e) => setSearchId(e.target.value)} 
        />
        <Button onClick={handleSearch}>Search</Button>
        <Select 
          placeholder="Filter by Gender" 
          value={genderFilter} 
          onChange={(e) => handleFilter(e.target.value)}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </Select>
      </Box>
      {displayedUsers && displayedUsers.length > 0 ? (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Gender</Th>
              <Th>Age</Th>
              <Th>View</Th>
              <Th>Edit</Th>
            </Tr>
          </Thead>
          <Tbody>
            {displayedUsers.map((user: User) => (
              <Tr key={user.id}>
                <Td>{user.id}</Td>
                <Td>{user.firstName} {user.lastName}</Td>
                <Td>{user.email}</Td>
                <Td>{user.gender}</Td>
                <Td>{user.age}</Td>
                <Td>
                  <Link as={RouterLink} to={`/users/${user.id}`} color="blue.500">
                    View Details
                  </Link>
                </Td>
                <Td>
                  <Link as={RouterLink} to={`/editusers/${user.id}`} color="green.500">
                    Edit
                  </Link>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Text>No users found.</Text>
      )}
    </Box>
  );
};

export default Users;


