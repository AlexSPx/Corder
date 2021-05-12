import React from "react";
import {
  ChatRoom,
  MessageInterface,
  SingleUser,
  ThemeInterface,
} from "../../../Interfaces";

export default function Message({
  members,
  lastMessageCalc,
  msg,
  index,
  userid,
  theme,
  room,
  setLastMessageRef,
  setFirstMessageRef,
}: {
  members: SingleUser[];
  lastMessageCalc: number;
  msg: MessageInterface;
  index: number;
  userid: string;
  theme: ThemeInterface;
  room: ChatRoom;
  setLastMessageRef: any;
  setFirstMessageRef: any;
}) {
  const mmbr: SingleUser = members.filter((mmbr) => mmbr.id === msg.userid)[0];

  const lastMessage = lastMessageCalc === index;
  const firstMessage = index === 0;

  if (msg.userid === userid) {
    return (
      <div
        ref={
          firstMessage
            ? setFirstMessageRef
            : lastMessage
            ? setLastMessageRef
            : null
        }
        className="flex flex-row items-center justify-end my-2 mx-3"
        key={msg.id}
      >
        <p
          className={`flex p-2 mx-2 justify-center rounded-full ${theme.background.darker}`}
        >
          {msg.message}
        </p>
      </div>
    );
  } else {
    return (
      <div
        ref={lastMessage ? setLastMessageRef : null}
        className="flex flex-row items-center my-2 mx-3"
        key={msg.id}
      >
        <img
          src={URL.createObjectURL(
            new Blob([new Uint8Array(mmbr.avatar.data)])
          )}
          alt={room.name}
          className={`flex h-12 w-12 rounded-full border cursor-pointer ${theme.profile}`}
        />
        <p className={`p-2 mx-2 rounded-full ${theme.background.darker}`}>
          {msg.message}
        </p>
      </div>
    );
  }
}
