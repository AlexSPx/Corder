import axios from "axios";
import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { Light } from "../../ColorTheme";
import { ThemeContext } from "../../Context/ThemeContext";
import { UserContext } from "../../Context/UserContext";
import { ThemeInterface } from "../../Interfaces";
import { baseurl } from "../../routes";

export default function Header() {
  const userCtx = useContext(UserContext);

  const themeCtx = useContext(ThemeContext);

  const theme =
    themeCtx?.themeData.data === undefined ? Light : themeCtx.themeData.data;

  const [menu, setMenu] = useState<boolean>(false);
  const handleMenu = () => {
    if (menu) {
      setMenu(false);
    } else {
      setMenu(true);
    }
  };

  return (
    <header
      className={`flex h-20 px-12 justify-between items-center ${theme.background.main}`}
    >
      <div className={`flex text-3xl font-bold ${theme.text.main}`}>Corder</div>
      <div className="flex">
        <Button label="Home" to="/" css={theme.text.main} />
        <Button label="To-do" to="/todo" css={theme.text.main} />
        <Button label="" to="/docs" css={theme.text.main} />
      </div>

      <div className="relative">
        <img
          className={`flex h-16 w-16 rounded-full border-2 cursor-pointer ${theme.profile}`}
          src={userCtx?.userData.avatar}
          alt="Avatar"
          onClick={handleMenu}
        />
        {menu ? (
          <Menu email={userCtx?.userData.email as string} theme={theme} />
        ) : (
          ""
        )}
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

const Menu = ({ email, theme }: { email: string; theme: ThemeInterface }) => {
  const handleSignOut = async () => {
    // eslint-disable-next-line no-restricted-globals
    event?.preventDefault();
    axios.get(`${baseurl}/authuser/signout`, { withCredentials: true });
    window.location.reload();
  };

  return (
    <div
      className={`absolute sm:block
      right-0 w-full mt-2 origin-top-right rounded-md shadow-lg md:w-48`}
    >
      <div
        className={`${theme.background.darker} ${theme.text.main} py-1 rounded-md w-48 divide-y divide-fuchsia-300 text-l`}
      >
        <div
          className={`block px-4 py-2 text-sm hover:${theme.background.light} my-1 cursor-pointer`}
        >
          <p className="text-lg">Signed in as</p>
          <p className={theme.text.secondary}>{email}</p>
        </div>
        <p
          className={`block px-4 py-2 text-sm hover:${theme.background.light} my-1 cursor-pointer`}
          onClick={handleSignOut}
        >
          Sign out
        </p>
      </div>
    </div>
  );
};
