import React, { useContext, useState } from "react";
import { Light } from "../../ColorTheme";
import { ThemeContext } from "../../Context/ThemeContext";
import { UserContext } from "../../Context/UserContext";
import { ImageIcon } from "../../public/SmallSvgs";

export default function Profile() {
  const userCtx = useContext(UserContext);
  const themeCtx = useContext(ThemeContext);

  const theme =
    themeCtx?.themeData.data === undefined ? Light : themeCtx.themeData.data;

  const [avatar, setAvatar] = useState(userCtx?.userData.avatar);
  const [username, setUsername] = useState(userCtx?.userData.username);
  const [name, setName] = useState(userCtx?.userData.name);

  return (
    <div
      className={`flex flex-col h-full w-full overflow-auto ${theme.background.body} font-thin`}
    >
      <div className="flex flex-row w-full justify-center items-center mt-6">
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
          <p className={`text-xl mt-3`}>Username</p>
          <input
            className={`${theme.background.body} border-b-2 focus:outline-none text-xl `}
            type="text"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setName(e.target.value)
            }
          />
        </div>
      </div>
    </div>
  );
}
