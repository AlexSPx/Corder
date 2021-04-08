import React, { useContext } from "react";
import { Light } from "../../ColorTheme";
import { ThemeContext } from "../../Context/ThemeContext";
import { Button } from "./Button";

export default function Header() {
  const themeCtx = useContext(ThemeContext);

  const theme =
    themeCtx?.themeData.data === undefined ? Light : themeCtx.themeData.data;

  return (
    <header
      className={`flex h-20 px-12 justify-between items-center ${theme.background.main}`}
    >
      <div className={`flex text-3xl font-bold ${theme.text.main}`}>Corder</div>
      <div className="flex">
        <Button
          label="Home"
          to="/"
          css={
            "flex mx-2 py-2 px-4 font-thin text-xl cursor-pointer " +
            theme.text.main
          }
        />
        <Button
          label="About"
          to="/about"
          css={
            "flex mx-2 py-2 px-4 font-thin text-xl cursor-pointer " +
            theme.text.main
          }
        />
        <Button
          label="Documentation"
          to="/docs"
          css={
            "flex mx-2 py-2 px-4 font-thin text-xl cursor-pointer " +
            theme.text.main
          }
        />
        <Button
          label="Sign Up"
          to="/signup"
          css={
            "flex mx-2 py-2 px-4 font-thin text-xl cursor-pointer " +
            theme.text.main
          }
        />
        <Button
          label="Login"
          to="/login"
          css={
            "flex mx-2 py-2 px-4 font-thin text-xl cursor-pointer " +
            theme.buttonColor +
            " rounded-md"
          }
        />
      </div>
    </header>
  );
}
