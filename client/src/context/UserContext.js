import React, { createContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children, value }) => (
  <UserContext.Provider value={value}>{children}</UserContext.Provider>
);

export default UserContext;
