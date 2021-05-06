import React from "react";
import { b64toBlob } from "../../functions";
import { ChatRoom, ThemeInterface } from "../../Interfaces";
import { defaultpfp } from "../../public/pfpdef";

export default function ChatCard({
  room,
  theme,
  teamName,
  selectRoom,
}: {
  room: ChatRoom;
  theme: ThemeInterface;
  teamName: string;
  selectRoom: React.Dispatch<React.SetStateAction<ChatRoom | undefined>>;
}) {
  const toRoom = () => {
    selectRoom(room);
  };
  return (
    <div
      className={`flex flex-row w-full h-16 border-b ${theme.border} font-thin items-center hover:${theme.background.darker} cursor-pointer`}
      onClick={() => toRoom()}
    >
      <img
        src={
          room.image
            ? URL.createObjectURL(new Blob([new Uint8Array(room.image.data)]))
            : URL.createObjectURL(b64toBlob(defaultpfp))
        }
        alt="avatar"
        className={`flex h-14 w-14 rounded-full border cursor-pointer ${theme.profile}`}
      />
      <p className="text-2xl mx-3">{room.name}</p>
    </div>
  );
}
