import React, { useContext } from "react";
import { Light } from "../../ColorTheme";
import { ThemeContext } from "../../Context/ThemeContext";
import LandingSvg from "../../public/LandingSvg";

export default function Landing() {
  const themeCtx = useContext(ThemeContext);
  const theme =
    themeCtx?.themeData.data === undefined ? Light : themeCtx.themeData.data;

  return (
    <div className={`flex flex-1 overflow-y-auto p-2 ${theme.background.body}`}>
      <div className="flex flex-col md:flex-row items-center justify-center w-full sm:mx-2 md:mx-8 lg:mx-32">
        <div className="flex flex-col">
          <p className={`text-lg font-bold my-1 ${theme.text.secondary}`}>
            Content Managment System
          </p>
          <p className={`text-5xl font-bold my-1 ${theme.text.main}`}>
            Secure and Reliable <br /> Option for Your Team
          </p>
          <p className={`text-lg font-bold my-1 ${theme.text.secondary}`}>
            We help from small to large start-ups track their progress. Our team
            of unique specialist can help you achieve your goals
          </p>
          <div
            className={`flex justify-center items-center my-5 py-2 px-4 w-3/6 lg:w-2/6 font-thin text-xl cursor-pointer rounded-md text-white ${theme.buttonColor}`}
            onClick={() => {}}
          >
            Get Started
          </div>
        </div>
        <div className="flex h-1/2">
          <LandingSvg />
        </div>
      </div>
    </div>
  );
}
