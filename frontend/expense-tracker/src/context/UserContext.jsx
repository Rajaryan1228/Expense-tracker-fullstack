import React, { createContext, useState } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  // Initialize with a demo user
  const [user, setUser] = useState({
    _id: "12345",
    fullName: "Demo User",
    email: "demo@example.com",
    profileImageUrl: "http://localhost:8000/uploads/1755185324042-pro.jpeg", // Default profile image
    // Add other properties as needed
  });

  // Function to update user information
  const updateUser = (userData) => {
    setUser(userData);
  };

  // Function to clear user information
  const clearUser = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
