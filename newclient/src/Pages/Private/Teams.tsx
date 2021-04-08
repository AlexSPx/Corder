import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Light } from "../../ColorTheme";
import InviteCard from "../../Components/Private/InviteCard";
import TeamCard from "../../Components/Private/TeamCard";
import { ThemeContext } from "../../Context/ThemeContext";
import { UserContext } from "../../Context/UserContext";
import { InviteInterface, TeamInterface } from "../../Interfaces";
import { baseurl } from "../../routes";

export default function Teams() {
  const themeCtx = useContext(ThemeContext);

  const theme =
    themeCtx?.themeData.data === undefined ? Light : themeCtx.themeData.data;

  const userCtx = useContext(UserContext);

  const [teams, setTeams] = useState<TeamInterface[]>();
  const [invites, setInvites] = useState<InviteInterface[]>();

  useEffect(() => {
    const fetchTeams = async () => {
      const teams = await axios.get<TeamInterface[]>(
        `${baseurl}/teams/myteams`,
        {
          withCredentials: true,
        }
      );
      setTeams(teams.data);
    };
    const fetchInvites = async () => {
      const invites = await axios.get<InviteInterface[]>(
        `${baseurl}/teams/myinvites`,
        {
          withCredentials: true,
        }
      );
      setInvites(invites.data);
    };

    fetchTeams();
    fetchInvites();
  }, []);

  const mapTeams = teams?.map((team) => {
    return (
      <TeamCard
        team={team}
        theme={theme}
        user={userCtx!.userData}
        key={team.id}
      />
    );
  });

  const mapInvites = invites?.map((invite) => {
    if (!invite.status) {
      return <InviteCard invite={invite} theme={theme} key={invite.id} />;
    } else return <div></div>;
  });

  return (
    <div
      className={`flex flex-wrap overflow-scroll h-full justify-center font-thin ${theme.text.main} ${theme.background.body}`}
    >
      <div className={`w-1/2 `}>
        <div className="flex text-2xl items-center h-28">Teams</div>
        <div className="flex flex-col">{mapTeams}</div>
        <div className="flex flex-col">{mapInvites}</div>
      </div>
    </div>
  );
}
