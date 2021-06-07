import React, { createContext } from "react";
import { userContextInterface, userDataInterface } from "../interfaces";

export const UserContext = createContext<userContextInterface | null>(null);

const UserCtxProvider: React.FC = (props) => {
  const [userData, setUserData] = React.useState<userDataInterface | any>(null);

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserCtxProvider;
