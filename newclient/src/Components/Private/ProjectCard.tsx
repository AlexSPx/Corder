import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ProjectInterface,
  TeamInterface,
  ThemeInterface,
} from "../../Interfaces";
import { TeamIcon, WebsiteIcon } from "../../public/SmallSvgs";
import { baseurl } from "../../routes";

export default function ProjectCard({
  project,
  theme,
}: {
  project: ProjectInterface;
  theme: ThemeInterface;
}) {
  const [team, setTeam] = useState<TeamInterface | null>();

  const dateCheck =
    project.range === null
      ? true
      : parseInt(project.range[0]) < Date.now()
      ? parseInt(project.range[1]) > Date.now()
        ? true
        : false
      : false;

  useEffect(() => {
    const fetchTeam = async () => {
      const team = await axios.post<TeamInterface[]>(
        `${baseurl}/teams/fetchteam`,
        { teamid: project.teamID[0] },
        {
          withCredentials: true,
        }
      );

      setTeam(team.data[0]);
    };
    fetchTeam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`flex flex-col h-28 border-b ${theme.border} hover:${theme.background.darker}`}
    >
      <div className="flex flex-col h-full justify-center">
        <div className="flex flex-row mb-4 mx-5 align-center justify-between">
          <div className={`flex flex-rol`}>
            {dateCheck ? <DateActive /> : <DateInactive />}
            <p className={`text-xl mx-3`}>{project.name}</p>
          </div>
          <div className={`flex text-lg`}>Visit Team</div>
        </div>
        <div className="flex mx-5 justify-between">
          <div className="flex">
            <TeamIcon />
            <p className={`mx-2`}>Team: {team?.displayname}</p>{" "}
            <p className={`${theme.text.secondary}`}>({team?.name})</p>
          </div>
          <div className={`flex ${theme.text.secondary} text-lg italic`}>
            <LinkedWebsite url={"https://corder-bg.xyz/"} website={"Corder"} />
          </div>
        </div>
      </div>
    </div>
  );
}
const DateActive = () => {
  return (
    <div className="flex h-5 w-5 mt-1 rounded-full bg-green-100 items-center justify-center">
      <div className="h-3 w-3 bg-green-400 rounded-full"></div>
    </div>
  );
};

const DateInactive = () => {
  return (
    <div className="flex h-5 w-5 mt-1 rounded-full bg-red-100 items-center justify-center">
      <div className="h-3 w-3 bg-red-400 rounded-full"></div>
    </div>
  );
};

const LinkedWebsite = ({ url, website }: { url: string; website: string }) => {
  return (
    <div
      className={`flex flex-row items-center cursor-pointer`}
      onClick={() => {
        // eslint-disable-next-line no-restricted-globals
        event?.preventDefault();
        window.open(url, "_blank");
      }}
    >
      <WebsiteIcon />
      <p>{website}</p>
    </div>
  );
};
