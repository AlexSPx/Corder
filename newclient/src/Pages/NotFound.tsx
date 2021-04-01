import React, { useContext } from "react";
import { Light } from "../ColorTheme";
import { ThemeContext } from "../Context/ThemeContext";

export default function NotFound() {
  const themeCtx = useContext(ThemeContext);

  const theme =
    themeCtx?.themeData.data === undefined ? Light : themeCtx.themeData.data;

  return (
    <div
      className={`flex flex-1 overflow-y-auto p-2 ${theme.background.body} items-center justify-center`}
    >
      <div className="flex flex-col items-center">
        <p className={`font-bold text-9xl ${theme.text.main}`}>404</p>
        <p className={`font-bold text-8xl ${theme.text.secondary}`}>
          Not Found
        </p>
      </div>
    </div>
  );
}
