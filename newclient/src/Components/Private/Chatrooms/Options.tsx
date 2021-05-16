import React, { useState } from "react";
import { ChatRoom, SingleUser, ThemeInterface } from "../../../Interfaces";
import { ImageIcon } from "../../../public/SmallSvgs";
import ImageCrop from "../ImageCrop";
import useOnlineQuery from "../useOnlineQuery";
import { Offline, Online } from "../UserCard";

export const ShowMembers = ({
  mmbrs,
  admins,
  theme,
}: {
  mmbrs: SingleUser[];
  admins: string[];
  theme: ThemeInterface;
}) => {
  const ids = mmbrs.map((mmbr) => mmbr.id);

  const { onlineUsers } = useOnlineQuery(ids, 10000);

  const mapMembers = mmbrs?.map((user) => {
    const isOnline = onlineUsers?.some((usr) => usr.id === user.id);

    return (
      <div className="flex flex-row my-1">
        <img
          src={URL.createObjectURL(
            new Blob([new Uint8Array(user.avatar.data)])
          )}
          alt={user.name}
          className={`flex h-14 w-14 bg-cover rounded-full border cursor-pointer ${theme.profile}`}
        />

        <div className="flex flex-col justify-center mx-3">
          <p className="flex flex-row">
            {isOnline ? <Online outer="mr-1" /> : <Offline outer="mr-1" />}
            {user.name}
          </p>
          {admins.includes(user.id) && (
            <p className={`text-sm ${theme.text.secondary}`}>Administrator</p>
          )}
        </div>
      </div>
    );
  });

  return (
    <div
      className={`flex flex-col justify-start w-5/6 pb-1 border-b ${theme.border}`}
    >
      {mapMembers}
    </div>
  );
};

export const ChangeIcon = ({
  theme,
  room,
}: {
  theme: ThemeInterface;
  room: ChatRoom;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`flex my-1 py-1 rounded-md hover:${theme.background.darker} w-5/6 justify-between items-center cursor-pointer`}
      onClick={() => setOpen(!open)}
    >
      <p className="text-lg ml-1">Change chat icon</p>
      <ImageIcon />

      {open && <ImageCrop />}
    </div>
  );
};
