import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Light } from "../../ColorTheme";
import useFetchMembers from "../../Components/Private/Queries/useFetchMembersQuery";
import useOnlineQuery from "../../Components/Private/Queries/useOnlineQuery";
import useTPAQuery from "../../Components/Private/Queries/useTPAQuery";
import { Offline, Online } from "../../Components/Private/UserCard";
import { ThemeContext } from "../../Context/ThemeContext";
import { SingleUser, TeamInterface, ThemeInterface } from "../../Interfaces";

export default function TeamMembers() {
  const { name } = useParams() as any;

  const themeCtx = useContext(ThemeContext);

  const theme =
    themeCtx?.themeData.data === undefined ? Light : themeCtx.themeData.data;

  const [team, setTeam] = useState<TeamInterface>();
  const [members, setMembers] = useState<SingleUser[]>([]);
  const [admins, setAdmins] = useState<SingleUser[]>([]);

  useTPAQuery({
    option: "Team",
    amount: "One",
    team: name,
    setData: setTeam,
  });

  const { members: allMembers } = useFetchMembers(team?.members!);
  const { onlineUsers } = useOnlineQuery(team?.members!, 15000);

  useEffect(() => {
    allMembers?.forEach((member) => {
      if (team?.admins.includes(member.id)) {
        setAdmins((admins) => [...admins, member]);
      } else {
        setMembers((members) => [...members, member]);
      }
    });

    return () => {
      setMembers([]);
      setAdmins([]);
    };
  }, [onlineUsers, allMembers]);

  const mapAdmins = admins.map((admin) => {
    const online = onlineUsers?.some((user) => user.id === admin.id)
      ? true
      : false;
    return <User user={admin} theme={theme} online={online} />;
  });

  const mapMembers = members.map((member) => {
    const online = onlineUsers?.some((user) => user.id === member.id)
      ? true
      : false;
    return <User user={member} theme={theme} online={online} />;
  });

  return (
    <div
      className={`flex flex-col h-full items-center font-thin ${theme.background.body}`}
    >
      <p className="text-3xl mt-6">{team?.displayname} - Members</p>
      <div className="flex flex-col w-3/4">
        <p className="text-2xl mb-2 my-1 italic">Admins</p>
        <div className="flex flex-wrap">{mapAdmins}</div>
        <p className="text-2xl mb-2 my-1 italic">Members</p>
        <div className="flex flex-wrap">{mapMembers}</div>
      </div>
    </div>
  );
}

const User = ({
  user,
  theme,
  online,
}: {
  user: SingleUser;
  theme: ThemeInterface;
  online: boolean;
}) => {
  return (
    <div className="mx-2">
      <div
        className={`flex flex-row items-center my-1 rounded-lg px-1 hover:${theme.background.darker} cursor-pointer`}
        key={user.id}
      >
        <img
          className={`object-cover w-20 h-20 rounded-full border-2 ${theme.profile}`}
          src={URL.createObjectURL(
            new Blob([new Uint8Array(user.avatar.data)])
          )}
          alt="avatar"
        />
        <div className="flex flex-col">
          <div className="flex flex-row">
            {online ? <Online outer="mr-1" /> : <Offline outer="mr-1" />}
            <p className="flex text-xl">{user.name}</p>
          </div>
          <p className={`flex mx-1 text-xl italic ${theme.text.secondary}`}>
            @{user.username}
          </p>
        </div>
      </div>
    </div>
  );
};
