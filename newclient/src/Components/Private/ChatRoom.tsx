import axios from "axios";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { socket } from "../..";
import { UserContext } from "../../Context/UserContext";
import { b64toBlob } from "../../functions";
import { ChatRoom, SingleUser, ThemeInterface } from "../../Interfaces";
import { defaultpfp } from "../../public/pfpdef";
import { DownArrow, SendMessage, UpArrow } from "../../public/SmallSvgs";
import { baseurl } from "../../routes";
import { LoadingFlexCenter } from "../Public/Loading";

export default function ChatRoomD({
  room,
  theme,
}: {
  room: ChatRoom;
  theme: ThemeInterface;
}) {
  const [showMembers, setShowMembers] = useState(false);
  const [allMembers, setAllMembers] = useState<SingleUser[]>();

  useEffect(() => {
    const fetchUsers = async () => {
      const resUsers = await axios.post(
        `${baseurl}/teams/fetchteammembers`,
        { ids: room.members },
        { withCredentials: true }
      );
      setAllMembers(resUsers.data);
    };
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-row w-full h-full ">
      <div className="flex h-full w-3/4">
        {allMembers && <Main theme={theme} room={room} members={allMembers} />}
      </div>
      <div
        className={`flex flex-col w-1/4 border-l ${theme.border} items-center`}
      >
        <img
          src={
            room.image
              ? URL.createObjectURL(new Blob([new Uint8Array(room.image.data)]))
              : URL.createObjectURL(b64toBlob(defaultpfp))
          }
          alt={room.name}
          className={`flex h-32 w-32 rounded-full border cursor-pointer mt-6 ${theme.profile}`}
        />
        <p className="text-3xl mt-2 mx-3 text-center overflow-hidden">
          {room.name}
        </p>
        <div className="flex flex-col items-center mx-3 w-full">
          <DropDown
            theme={theme}
            label={"Show chat members"}
            state={showMembers}
            setState={setShowMembers}
          />
          {showMembers && allMembers && (
            <ShowMembers
              mmbrs={allMembers}
              admins={room.admins}
              theme={theme}
            />
          )}
        </div>
      </div>
    </div>
  );
}

const DropDown = ({
  label,
  theme,
  state,
  setState,
}: {
  label: string;
  theme: ThemeInterface;
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div
      className={`flex mt-4 my-2 py-1 rounded-md hover:${theme.background.darker} w-5/6 justify-between items-center cursor-pointer`}
      onClick={() => setState(!state)}
    >
      <p className="text-lg ml-1">{label}</p>
      {state ? <UpArrow css="mr-1" /> : <DownArrow css="mr-1" />}
    </div>
  );
};

const ShowMembers = ({
  mmbrs,
  admins,
  theme,
}: {
  mmbrs: SingleUser[];
  admins: string[];
  theme: ThemeInterface;
}) => {
  const mapMembers = mmbrs?.map((user) => {
    return (
      <div className="flex flex-row my-1">
        <img
          src={URL.createObjectURL(
            new Blob([new Uint8Array(user.avatar.data)])
          )}
          alt={user.name}
          className={`flex h-14 w-14 rounded-full border cursor-pointer ${theme.profile}`}
        />
        <div className="flex flex-col justify-center mx-3">
          <p>{user.name}</p>
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

interface MessageInterface {
  id?: string;
  message: string;
  roomid: string;
  userid: string;
}

const Main = ({
  theme,
  room,
  members,
}: {
  theme: ThemeInterface;
  room: ChatRoom;
  members: SingleUser[];
}) => {
  const userCtx = useContext(UserContext);

  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [sendMessage, setSendMessage] = useState<string>();
  const [loadingMessages, setLoadingMessages] = useState(true);

  const setRef = useCallback((node) => {
    if (node) {
      node.scrollIntoView({ smooth: true });
    }
  }, []);

  const emmitMessage = async () => {
    // eslint-disable-next-line no-restricted-globals
    event?.preventDefault();
    if (sendMessage) {
      const newMessage: MessageInterface = {
        message: sendMessage,
        roomid: room.id,
        userid: userCtx?.userData.id!,
      };
      socket.emit(`send-message`, newMessage);
      setSendMessage("");
    }
  };

  useEffect(() => {
    const eventName = `remote-message-${room.id}`;

    socket.on(eventName, (message: MessageInterface) => {
      setMessages((old: any) => [...old, message]);
    });

    const fetchMessages = async () => {
      const msgRes = await axios.get(
        `${baseurl}/chat/messages/initial/${room.id}`,
        { withCredentials: true }
      );
      setMessages(msgRes.data);
      setLoadingMessages(false);
    };

    fetchMessages();
    setMessages([]);

    return () => {
      socket.off(eventName);
    };
  }, [room]);

  const mapMessages = messages.map((msg, index) => {
    const mmbr: SingleUser = members.filter(
      (mmbr) => mmbr.id === msg.userid
    )[0];
    const lastMessage = messages.length - 1 === index;

    if (msg.userid === userCtx?.userData.id) {
      return (
        <div
          ref={lastMessage ? setRef : null}
          className="flex flex-row items-center justify-end my-2 mx-3"
          key={msg.id}
        >
          <p className={`p-2 mx-2 rounded-full ${theme.background.darker}`}>
            {msg.message}
          </p>
        </div>
      );
    } else {
      return (
        <div
          ref={lastMessage ? setRef : null}
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
  });

  return (
    <div className={`flex flex-col w-full h-full justify-between`}>
      {loadingMessages ? (
        <LoadingFlexCenter />
      ) : (
        <div className="flex flex-col max-h-(screen-16) w-full overflow-auto">
          {mapMessages}
        </div>
      )}

      <div
        className={`flex w-full h-16 items-center justify-center border-t ${theme.border}`}
      >
        <input
          type="text"
          placeholder="type a message..."
          id="msgsender"
          className={`w-4/6 h-10 text-lg rounded-full focus:outline-none px-6 ${theme.background.darker}`}
          value={sendMessage}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
            setSendMessage(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              emmitMessage();
            }
          }}
        />
        <div className="flex cursor-pointer" onClick={() => emmitMessage()}>
          <SendMessage />
        </div>
      </div>
    </div>
  );
};
