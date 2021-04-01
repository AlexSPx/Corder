import React, { useContext, useState } from "react";
import { Light } from "../../ColorTheme";
import { ThemeContext } from "../../Context/ThemeContext";
import { b64toBlob } from "../../functions";
import { defaultpfp } from "../../public/pfpdef";
import { SignupInterface } from "../../Interfaces";
import { baseurl } from "../../routes";
import axios from "axios";
import { useHistory } from "react-router";

export default function Signup() {
  const themeCtx = useContext(ThemeContext);

  const theme =
    themeCtx?.themeData.data === undefined ? Light : themeCtx.themeData.data;

  const history = useHistory();

  const [avatar, setAvatar] = useState(b64toBlob(defaultpfp));
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cfpassword, setCfpassword] = useState("");

  const handleRegister = async () => {
    const newUser: SignupInterface = {
      username,
      name,
      email,
      password,
      passwordCheck: cfpassword,
    };

    const avatarSet = new FormData();
    avatarSet.append("avatar", avatar);

    // eslint-disable-next-line no-restricted-globals
    event?.preventDefault();

    const res = await fetch(`${baseurl}/authuser/register`, {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    setTimeout(
      await axios.post(`${baseurl}/authuser/changepfp`, avatarSet, {
        withCredentials: true,
      }),
      5000
    );

    if (res.ok) {
      history.push("/");
      window.location.reload();
    }
  };

  return (
    <div className={`flex flex-1 overflow-y-auto p-2 ${theme.background.body}`}>
      <div className="flex h-full w-full items-center justify-center">
        <div className={`flex h-3/6 w-5/6 lg:h-2/3 lg:w-2/3`}>
          <div
            className={`flex flex-col w-1/2 p-10 border-l border-t border-b rounded-l-2xl items-center justify-center ${theme.border} ${theme.background.light}`}
          >
            <label className="flex w-64 h-64 rounded-full cursor-pointer">
              <img
                src={URL.createObjectURL(avatar)}
                className="flex w-64 h-64 rounded-full cursor-pointer object-cover"
                alt="avatar"
              />
              <input
                type="file"
                className="hidden"
                onChange={(e: React.ChangeEvent<any>): void =>
                  setAvatar(e.target.files[0])
                }
              />
            </label>
            <p className={`text-2xl font-thin ${theme.text.main}`}>
              Select a profile image
            </p>
          </div>
          <div
            className={`flex flex-col w-1/2 border-r border-t border-b rounded-r-2xl items-center justify-center ${theme.text.main} ${theme.border} ${theme.background.light}`}
          >
            <div className="flex mb-2 w-5/6">
              <div className="mb-4 w-1/2">
                <label
                  className={`block text-grey-darker text-sm font-bold mb-2`}
                >
                  Name
                </label>
                <input
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker ${theme.background.main} ${theme.border}`}
                  id="name"
                  type="text"
                  placeholder="Name"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                    setName(e.target.value)
                  }
                />
              </div>
              <div className="mb-4 w-1/2">
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
            </div>
            <div className="mb-4 w-5/6">
              <label className="block text-grey-darker text-sm font-bold mb-2">
                Email
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker ${theme.background.main} ${theme.border}`}
                id="email"
                type="text"
                placeholder="Email"
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                  setEmail(e.target.value)
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
            <div className="mb-4 w-5/6">
              <label className="block text-grey-darker text-sm font-bold mb-2">
                Confirm Password
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker ${theme.background.main} ${theme.border}`}
                id="cpassword"
                type="password"
                placeholder="Confirm Password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                  setCfpassword(e.target.value)
                }
              />
            </div>
            <button
              className={`${theme.buttonColor} w-5/6 lg:w-4/6 rounded text-2xl font-thin py-1 my-3`}
              onClick={() => handleRegister()}
            >
              Sign up
            </button>
            <p className="text-xl font-thin">{}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
