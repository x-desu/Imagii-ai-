import { View, Text } from "react-native";
import React, { createContext, useContext, useState } from "react";

export const UserContext = createContext();

const UserProvider = ({ children, value }) => {
  const [userDetails, setUserDetails] = useState();
  return (
    <UserContext.Provider value={{ userDetails, setUserDetails }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserSession = () => useContext(UserContext);

export default UserProvider;
