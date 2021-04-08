import React from "react";
import { OnlineUserInterface, ThemeInterface } from "../../Interfaces";

export default function UserCard({
  user,
  theme,
}: {
  user: OnlineUserInterface;
  theme: ThemeInterface;
}) {
  return (
    <div
      className={`flex w-full h-12 md:h-24 rounded-full border ${theme.profile} items-center my-1`}
    >
      <div className={`flex w-12 md:w-24 rounded-full items-center`}>
        <img
          className={`object-cover w-12 h-12 md:w-24 md:h-24 rounded-full border-2 ${theme.profile}`}
          src={URL.createObjectURL(
            new Blob([new Uint8Array(user.avatar.data)])
          )}
          alt="avatar"
        />
      </div>
      <div className="flex flex-col">
        <div className="flex">
          <Online />
          <p className="ml-1">{user.name}</p>
        </div>
        <p className={`ml-6 ${theme.text.secondary}`}>@{user.username}</p>
      </div>
    </div>
  );
}

const Online = () => {
  return (
    <div className="flex h-5 w-5 mt-1 ml-1 rounded-full bg-green-100 items-center justify-center">
      <div className="h-3 w-3 bg-green-400 rounded-full"></div>
    </div>
  );
};

const Offline = () => {
  return (
    <div className="flex h-5 w-5 mt-1 rounded-full bg-red-100 items-center justify-center">
      <div className="h-3 w-3 bg-red-400 rounded-full"></div>
    </div>
  );
};
