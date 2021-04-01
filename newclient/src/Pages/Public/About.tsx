import React, { useContext } from "react";
import { Light } from "../../ColorTheme";
import { ThemeContext } from "../../Context/ThemeContext";
import AboutSvg from "../../public/AboutSvg";

export default function About() {
  const themeCtx = useContext(ThemeContext);

  const theme =
    themeCtx?.themeData.data === undefined ? Light : themeCtx.themeData.data;

  return (
    <div className={`flex flex-1 overflow-y-auto p-2 ${theme.background.body}`}>
      <div className="flex flex-col items-center justify-center w-full">
        <div className={`text-7xl font-thin my-3 ${theme.text.main}`}>
          About
        </div>
        <div className={`flex text-xl ${theme.text.main}`}>
          A CMS project for the National Olympiad in Information Technology 2021
        </div>
        <div className="flex w-1/5">
          <AboutSvg />
        </div>
      </div>
    </div>
  );
}
