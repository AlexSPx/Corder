import React, { useState } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router";
import { b64toBlob } from "../../../functions";
import { ChatRoom, ThemeInterface } from "../../../Interfaces";
import { defaultpfp } from "../../../public/pfpdef";

export default function ChatCard({
  room,
  theme,
  teamName,
  selectedRoom,
}: {
  room: ChatRoom;
  theme: ThemeInterface;
  teamName: string;
  selectedRoom: ChatRoom | undefined;
}) {
  const [selected, setSelected] = useState(false);

  const history = useHistory();

  const toRoom = () => {
    history.push(`/${teamName}/chats/${room.id}`);
  };

  useEffect(() => {
    if (selectedRoom) {
      if (selectedRoom?.id === room.id) {
        setSelected(true);
      } else {
        setSelected(false);
      }
    } else {
      setSelected(false);
    }
  }, [selectedRoom, room.id]);

  return (
    <div
      className={`flex w-full h-16 font-thin items-center px-2 cursor-pointer mb-1`}
      onClick={() => toRoom()}
    >
      <div
        className={`flex flex-row hover:${theme.background.darker} ${
          selected && theme.background.darker
        } items-center rounded-md w-full h-full pl-1`}
      >
        <img
          src={
            room.image
              ? URL.createObjectURL(new Blob([new Uint8Array(room.image.data)]))
              : URL.createObjectURL(b64toBlob(defaultpfp))
          }
          alt="avatar"
          className={`flex h-12 w-12 rounded-full border cursor-pointer ${theme.profile}`}
        />
        <div className="flex flex-col justify-center ml-2">
          <p className="text-xl">{room.name}</p>
          {/* <p>1 online</p> */}
        </div>
      </div>
    </div>
  );
}
