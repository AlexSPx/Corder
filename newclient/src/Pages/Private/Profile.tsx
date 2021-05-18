import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Light } from "../../ColorTheme";
import ConfirmPassword from "../../Components/Private/ConfirmPassword";
import { ThemeContext } from "../../Context/ThemeContext";
import { UserContext } from "../../Context/UserContext";
import { EmailIcon, ImageIcon } from "../../public/SmallSvgs";
import { baseurl } from "../../routes";

export default function Profile() {
  const userCtx = useContext(UserContext);
  const themeCtx = useContext(ThemeContext);

  const theme =
    themeCtx?.themeData.data === undefined ? Light : themeCtx.themeData.data;

  const [avatar, setAvatar] = useState(userCtx?.userData.avatar);
  const [username, setUsername] = useState(userCtx?.userData.username);
  const [name, setName] = useState(userCtx?.userData.name);
  const [email, setEmail] = useState(userCtx?.userData.email);
  const [authMenu, setAuthMenu] = useState(false);
  const [authCheckP, setAuthCheckP] = useState(false);

  const activateAuthMenu = () => {
    if (
      avatar !== userCtx?.userData.avatar ||
      username !== userCtx?.userData.username ||
      name !== userCtx?.userData.name
    ) {
      setAuthMenu(true);
    } else {
      console.log("no changes");
    }
  };

  useEffect(() => {
    const saveChanges = async () => {
      if (
        username !== userCtx?.userData.username ||
        name !== userCtx?.userData.name
      ) {
        await axios.post(
          `${baseurl}/authuser/changes`,
          {
            newName: name,
            newUsername: username,
          },
          { withCredentials: true }
        );
      }

      if (avatar !== userCtx?.userData.avatar) {
        const avatarSet = new FormData();
        avatarSet.append("avatar", avatar);
        await axios.post(`${baseurl}/authuser/changepfp`, avatarSet, {
          withCredentials: true,
        });
      }

      window.location.reload();

      setAuthCheckP(false);
    };

    if (authCheckP) {
      saveChanges();
    }
  }, [authCheckP]);

  return (
    <div
      className={`flex flex-col h-full w-full overflow-auto ${theme.background.body} font-thin`}
    >
      <LineBreak label="Public Settings" />
      <div className="flex flex-row w-full justify-center items-center ">
        <label className="cursor-pointer">
          <div
            className={`absolute w-24 h-24 md:w-48 md:h-48 rounded-full ${theme.background.body} opacity-0 hover:opacity-50`}
          >
            <div className="flex flex-col w-full h-full items-center justify-center">
              <ImageIcon css="w-12 h-12" />
              <p className="hidden md:flex">Change Avatar</p>
            </div>
          </div>
          <img
            className={`object-cover w-24 h-24 md:w-48 md:h-48 rounded-full border-2 ${theme.profile}`}
            src={URL.createObjectURL(avatar)}
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
        <div className="flex flex-col ml-3">
          <p className={`text-xl`}>Username</p>
          <input
            className={`${theme.background.body} border-b-2 focus:outline-none text-xl `}
            type="text"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setUsername(e.target.value)
            }
          />
          <p className={`text-xl mt-3`}>Name</p>
          <input
            className={`${theme.background.body} border-b-2 focus:outline-none text-xl `}
            type="text"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setName(e.target.value)
            }
          />
          <button
            className={`mt-2 py-1 rounded-lg border ${theme.buttonColor}`}
            onClick={() => activateAuthMenu()}
          >
            Save changes
          </button>

          {authMenu && (
            <ConfirmPassword
              theme={theme}
              setAuthMenu={setAuthMenu}
              setAuth={setAuthCheckP}
            />
          )}
        </div>
      </div>
      <LineBreak label="Change Email" />
      <div className="flex flex-row justify-center items-center">
        <div className="flex flex-col mx-3">
          <p className={`italic ${theme.text.secondary}`}>
            Current Email: {userCtx?.userData.email}
          </p>
          <div className="flex flex-row items-center border-b-2">
            <EmailIcon css="mt-1" />
            <input
              className={`${theme.background.body} focus:outline-none text-xl px-4`}
              type="text"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setEmail(e.target.value)
              }
            />
          </div>
          <button
            className={`mt-2 py-1 rounded-lg border ${theme.buttonColor}`}
          >
            Send Code
          </button>
          <div className="flex flex-col mt-3">
            <p className={`text-xl `}>Activation Code</p>
            <div className="flex">
              <input
                className={`${theme.background.body} focus:outline-none text-xl `}
                type="text"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                  setEmail(e.target.value)
                }
              />
            </div>
          </div>
        </div>
        <div className="flex w-36 h-36 rounded-full border"></div>
      </div>
    </div>
  );
}

const LineBreak = ({ label }: { label: string }) => {
  return (
    <div className="flex items-center justify-center my-5 mt-12">
      <div className="flex border-b-2 w-1/5"></div>
      <p className="mx-2 text-xl">{label}</p>
      <div className="flex border-b-2 w-1/5"></div>
    </div>
  );
};