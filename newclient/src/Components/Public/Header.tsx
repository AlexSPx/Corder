import React, { useContext } from "react";
import { Light } from "../../ColorTheme";
import { useHistory } from "react-router";
import { ThemeContext } from "../../Context/ThemeContext";

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
        <Button label="Home" to="/" css={theme.text.main} />
        <Button label="About" to="/about" css={theme.text.main} />
        <Button label="Documentation" to="/docs" css={theme.text.main} />
        <Button label="Sign Up" to="/signup" css={theme.text.main} />
        <Button
          label="Login"
          to="/login"
          css={theme.buttonColor + " rounded-md"}
        />
      </div>
    </header>
  );
}

const Button = ({
  label,
  to,
  css,
}: {
  label: string;
  to: string;
  css: string;
}) => {
  const history = useHistory();

  const goto = (to: string) => history.push(to);
  return (
    <div
      className={`flex mx-2 py-2 px-4 font-thin text-xl cursor-pointer ${css}`}
      onClick={() => goto(to)}
    >
      {label}
    </div>
  );
};
