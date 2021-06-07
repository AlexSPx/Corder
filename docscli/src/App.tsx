import axios from "axios";
import React, { useContext, useEffect } from "react";
import UserCtxProvider, { UserContext } from "./Context/UserContext";
import Activation from "./Pages/Private/Activation";
import RoutesPrivate from "./Pages/Private/RoutesPrivate";
import Routes from "./Pages/Public/Routes";
import { baseurl } from "./routes";

export default function App() {
  return (
    <UserCtxProvider>
      <Distributor />
    </UserCtxProvider>
  );
}

const Distributor = () => {
  const userCtx = useContext(UserContext);

  useEffect(() => {
    const fetchuser = async () => {
      const userRes = await axios.get(`${baseurl}/authuser/fetchuser`, {
        withCredentials: true,
      });

      const avatarRes = await axios.get(`${baseurl}/authuser/getpfp`, {
        withCredentials: true,
        responseType: "blob",
      });

      const avatar = avatarRes.data;

      const userData = { ...userRes.data, avatar };

      if (userRes.status) {
        userCtx?.setUserData(userData);
        // socket.emit("conn", {
        //   user: {
        //     id: userData.id,
        //     username: userData.username,
        //     name: userData.name,
        //     email: userData.email,
        //     avatar: avatarRes.data,
        //   },
        // });
      } else {
        userCtx?.setUserData(null);
      }
    };

    fetchuser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return userCtx?.userData ? (
    userCtx.userData.isActivated ? (
      <RoutesPrivate />
    ) : (
      <Activation />
    )
  ) : (
    <Routes />
  );
};
