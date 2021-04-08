import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { socket } from ".";
import { Dark, Light } from "./ColorTheme";
import ThemeCtxProvider, { ThemeContext } from "./Context/ThemeContext";
import UserCtxProvider, { UserContext } from "./Context/UserContext";
import { ThemeInterface } from "./Interfaces";
import Activation from "./Pages/Private/Activation";
import RoutesPrivate from "./Pages/Private/RoutesPrivate";
import Routes from "./Pages/Public/Routes";
import { baseurl } from "./routes";

export default function App() {
  return (
    <UserCtxProvider>
      <ThemeCtxProvider>
        <Distributor />
      </ThemeCtxProvider>
    </UserCtxProvider>
  );
}

const Distributor = () => {
  const userCtx = useContext(UserContext);
  const themeCtx = useContext(ThemeContext);

  useEffect(() => {
    const fetchuser = async () => {
      const userRes = await axios.get(`${baseurl}/authuser/fetchuser`, {
        withCredentials: true,
      });

      const avatarRes = await axios.get(`${baseurl}/authuser/getpfp`, {
        withCredentials: true,
        responseType: "blob",
      });

      const avatar = URL.createObjectURL(avatarRes.data);

      const userData = { ...userRes.data, avatar };

      if (userRes.status) {
        userCtx?.setUserData(userData);
        socket.emit("conn", {
          user: {
            id: userData.id,
            username: userData.username,
            name: userData.name,
            email: userData.email,
            avatar: avatarRes.data,
          },
        });
      } else {
        userCtx?.setUserData(null);
      }
    };

    const themeSet = () => {
      switch (themeCtx?.themeData.theme) {
        case "Light":
          themeCtx.setThemeData({ theme: "Light", data: Light });
          break;
        case "Dark":
          themeCtx.setThemeData({ theme: "Light", data: Dark });
          break;
        default:
          themeCtx?.setThemeData({ theme: "Light", data: Light });
      }
    };

    themeSet();
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
