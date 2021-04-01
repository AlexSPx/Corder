import React, { useContext, useState } from "react";
import { Light } from "../../ColorTheme";
import { ThemeContext } from "../../Context/ThemeContext";
import { baseurl } from "../../routes";
import LoginSvg from "../../public/LoginSvg";

export default function Login() {
  const themeCtx = useContext(ThemeContext);

  const theme =
    themeCtx?.themeData.data === undefined ? Light : themeCtx.themeData.data;

  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    // eslint-disable-next-line no-restricted-globals
    event?.preventDefault();

    const userData = { username, password };

    const tokens = await fetch(`${baseurl}/authuser/login`, {
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    console.log(tokens);
    if (tokens.ok) {
      window.location.reload();
    } else {
      setError("Wrong username or password");
    }
  };

  return (
    <div className={`flex flex-1 overflow-y-auto p-2 ${theme.background.body}`}>
      <div className="flex h-full w-full items-center justify-center">
        <div className={`flex h-3/6 w-5/6 lg:h-1/2 lg:w-1/2`}>
          <div
            className={`flex w-1/2 p-10 border-l border-t border-b rounded-l-2xl items-center ${theme.border} ${theme.background.light}`}
          >
            <LoginSvg />
          </div>
          <div
            className={`flex flex-col w-1/2 border-r border-t border-b rounded-r-2xl items-center justify-center ${theme.text.main} ${theme.border} ${theme.background.light}`}
          >
            <div className="mb-4 w-5/6">
              <label
                className={`block text-grey-darker text-sm font-bold mb-2`}
              >
                Username
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker ${theme.background.main} ${theme.border}`}
                id="username"
                type="text"
                placeholder="Username"
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                  setUsername(e.target.value)
                }
              />
            </div>
            <div className="mb-4 w-5/6">
              <label className="block text-grey-darker text-sm font-bold mb-2">
                Password
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker ${theme.background.main} ${theme.border}`}
                id="password"
                type="password"
                placeholder="Password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                  setPassword(e.target.value)
                }
              />
            </div>
            <button
              className={`${theme.buttonColor} w-5/6 lg:w-4/6 rounded text-2xl font-thin py-1 my-3`}
              onClick={() => handleLogin()}
            >
              Login
            </button>
            <p className="text-xl font-thin">{error}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
