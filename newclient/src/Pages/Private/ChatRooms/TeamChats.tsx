import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Light } from "../../../ColorTheme";
import ChatCard from "../../../Components/Private/Chatrooms/ChatCard";
import ChatRoomD from "../../../Components/Private/Chatrooms/ChatRoom";
import { TeamHeader } from "../../../Components/Private/Chatrooms/Header";
import ToggleButton from "../../../Components/Private/ToggleButton";
import UserSelector from "../../../Components/Private/UserSelector";
import { ThemeContext } from "../../../Context/ThemeContext";
import { b64toBlob } from "../../../functions";
import { ChatRoom, TeamInterface, ThemeInterface } from "../../../Interfaces";
import { defaultpfp } from "../../../public/pfpdef";
import { baseurl } from "../../../routes";

export default function TeamChats() {
  const themeCtx = useContext(ThemeContext);
  const theme =
    themeCtx?.themeData.data === undefined ? Light : themeCtx.themeData.data;

  const { name, id } = useParams() as any;

  const [team, setTeam] = useState<TeamInterface>();
  const [createTeamToggle, setCreateTeamToggle] = useState(false);
  const [rooms, setRooms] = useState<ChatRoom[]>();
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom>();

  useEffect(() => {
    const fetchTeam = async () => {
      const team = await axios.post<TeamInterface[]>(
        `${baseurl}/teams/fetchteambyname`,
        { name },
        { withCredentials: true }
      );
      setTeam(team.data[0]);
    };
    fetchTeam();
  }, [name]);

  useEffect(() => {
    const fetchChats = async () => {
      const rooms = await axios.get(`${baseurl}/chat/fetch/${team?.id}`, {
        withCredentials: true,
      });

      setRooms(rooms.data);
    };
    fetchChats();

    if (rooms && id) {
    }
  }, [team]);

  useEffect(() => {
    setSelectedRoom(rooms?.find((room) => room.id === id));
  }, [id, rooms]);

  const mapRooms = rooms?.map((room) => {
    return (
      <ChatCard
        teamName={name}
        room={room}
        theme={theme}
        key={room.id}
        selectedRoom={selectedRoom}
      />
    );
  });

  return (
    <div
      className={`flex flex-row h-full w-full ${theme.background.body} font-thin`}
    >
      {createTeamToggle && (
        <CreateChat
          theme={theme}
          team={team!}
          setStatus={setCreateTeamToggle}
        />
      )}
      <div
        className={`flex flex-col w-1/5 justify-between border-r ${theme.border}`}
      >
        <div className="flex flex-col">
          <div className="flex flex-col border-b">
            {team && <TeamHeader team={team} theme={theme} />}
          </div>
          <div className="flex flex-col mt-1 overflow-auto" id="journal-scroll">
            {!(mapRooms?.length === 0) ? (
              <div className="flex flex-col max-h-(screen-24)">{mapRooms}</div>
            ) : (
              <div
                className={`flex items-center justify-center h-32 text-lg px-3 text-center italic ${theme.text.secondary}`}
              >
                Start by creating a general <br /> chat-room for your team
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-center">
          <button
            className={`flex ${theme.buttonColor} py-2 px-10 rounded-lg my-4 justify-center w-2/3`}
            onClick={() => setCreateTeamToggle(!createTeamToggle)}
          >
            Create new chat
          </button>
        </div>
      </div>
      <div className="flex w-5/6">
        {selectedRoom ? (
          <ChatRoomD room={selectedRoom} theme={theme} />
        ) : (
          <NoRoom />
        )}
      </div>
    </div>
  );
}

const NoRoom = () => {
  return (
    <div className="flex w-full h-full items-center justify-center text-3xl">
      No Room Selected
    </div>
  );
};

const CreateChat = ({
  theme,
  team,
  setStatus,
}: {
  theme: ThemeInterface;
  team: TeamInterface;
  setStatus: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [name, setName] = useState<string>();
  const [toggleMembers, setToggleMembers] = useState(false);
  const [toggleAdmins, setToggleAdmins] = useState(false);
  const [members, setMembers] = useState<string[]>([]);
  const [admins, setAdmins] = useState<string[]>([]);
  const [image, setImage] = useState<Blob>(b64toBlob(defaultpfp));

  const CreateChat = async () => {
    if (name) {
      const newChatRoom = {
        teamID: [team.id],
        name,
        members: toggleMembers
          ? members
            ? members
            : team.members
          : team.members,
        admins: toggleAdmins ? (admins ? admins : team.admins) : team.admins,
      };

      const res = await axios.post(
        `${baseurl}/chat/create`,
        { newChatRoom },
        { withCredentials: true }
      );

      const imageTransfer = new FormData();
      imageTransfer.append("image", image);

      setTimeout(
        await axios.post(
          `${baseurl}/chat/changeimg/${res.data}`,
          imageTransfer,
          {
            withCredentials: true,
          }
        ),
        5000
      );

      if (res.status === 200) {
        window.location.reload();
      }
    }
  };

  return (
    <div
      className={`absolute top-1/4 left-1/3 w-1/3 border rounded ${theme.profile} ${theme.background.main}`}
    >
      <div className="flex flex-col w-full items-center my-1">
        <p className={`text-center text-2xl`}>Create new Chatroom</p>
        <label className="flex w-32 h-32 rounded-full cursor-pointer">
          <img
            src={URL.createObjectURL(image)}
            className="flex w-32 h-32 rounded-full cursor-pointer object-cover"
            alt="avatar"
          />
          <input
            type="file"
            className="hidden"
            onChange={(e: React.ChangeEvent<any>): void =>
              setImage(e.target.files[0])
            }
          />
        </label>
        <div className="flex flex-col w-2/3">
          <label className="text-lg ml-1">Room Name</label>
          <input
            type="text"
            placeholder="chatroom name"
            className={`appearance-none border w-full py-2 px-3 text-grey-darker ${theme.background.main} ${theme.border}`}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setName(e.target.value)
            }
          />
        </div>
        <div className="flex flex-col w-2/3">
          <label className="text-lg ml-1">Specify members?</label>
          <ToggleButton value={toggleMembers} onChange={setToggleMembers} />
          {toggleMembers && (
            <div className="border-t border-b">
              <UserSelector
                ids={team.members}
                selected={members}
                setSelected={setMembers}
              />
            </div>
          )}
        </div>
        <div className="flex flex-col w-2/3">
          <label className="text-lg ml-1">Specify admins?</label>
          <ToggleButton value={toggleAdmins} onChange={setToggleAdmins} />
          {toggleAdmins && (
            <div className="border-t border-b">
              <UserSelector
                ids={team.members}
                selected={members}
                setSelected={setAdmins}
              />
            </div>
          )}
        </div>
        <button
          className={`flex ${theme.buttonColor} py-2 px-10 mt-6 justify-center w-2/3`}
          onClick={() => CreateChat()}
        >
          Submit
        </button>
        <button
          className={`flex border ${theme.profile} py-2 px-10 mt-1 mb-3 justify-center w-2/3`}
          onClick={() => setStatus(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
