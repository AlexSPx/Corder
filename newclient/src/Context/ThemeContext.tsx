import React, { createContext } from "react";
import { Light } from "../ColorTheme";
import { themeDataInterface, themeContextInterface } from "../Interfaces";

type SetValue = (value: any) => void;

export const ThemeContext = createContext<themeContextInterface | null>(null);

const ThemeCtxProvider: React.FC = (props) => {
  const [themeData, setThemeData] = React.useState<themeDataInterface | any>({
    theme: "Light",
  });

  return (
    <ThemeContext.Provider
      value={{
        themeData,
        setThemeData,
      }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
};

export default ThemeCtxProvider;
