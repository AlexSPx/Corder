import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { useParams } from "react-router";
import { Light } from "../../ColorTheme";
import ProjectCard from "../../Components/Private/ProjectCard";
import ToggleButton from "../../Components/Private/ToggleButton";
import UserCard from "../../Components/Private/UserCard";
import UserSelector from "../../Components/Private/UserSelector";
import { ThemeContext } from "../../Context/ThemeContext";
import { UserContext } from "../../Context/UserContext";
import {
  OnlineUserInterface,
  ProjectInterface,
  TeamInterface,
  ThemeInterface,
} from "../../Interfaces";
import { baseurl } from "../../routes";

export default function TeamProjects() {
  const themeCtx = useContext(ThemeContext);
  const userCtx = useContext(UserContext);

  const theme =
    themeCtx?.themeData.data === undefined ? Light : themeCtx.themeData.data;

  const { name } = useParams() as any;

  const [team, setTeam] = useState<TeamInterface>();
  const [projects, setProjects] = useState<ProjectInterface[]>();
  const [onlineUsers, setOnlineUsers] = useState<OnlineUserInterface[]>();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      const projects = await axios.post<ProjectInterface[]>(
        `${baseurl}/projects/fetchteamprojects`,
        {
          teamid: team?.id,
        },
        { withCredentials: true }
      );

      setProjects(projects.data);
    };

    const fetchOnline = async () => {
      const online = await axios.post<OnlineUserInterface[]>(
        `${baseurl}/teams/fetchonline`,
        { ids: team?.members },
        { withCredentials: true }
      );

      // team?.members.forEach((mmbr) => {
      //   for (const [key, value] of Object.entries(online.data)) {
      //     if (key === "id") {
      //       console.log(value);
      //     }
      //   }
      // });

      if (!compare(online.data, onlineUsers)) {
        setOnlineUsers(online.data);
      }
    };

    fetchProjects();
    fetchOnline();
    const interval = setInterval(() => fetchOnline(), 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [team]);

  const mapProjects = projects?.map((project) => {
    return (
      <ProjectCard
        project={project}
        theme={theme}
        key={project.id.toString()}
      />
    );
  });

  const mapOnlineUsers = onlineUsers?.map((user) => {
    return <UserCard user={user} theme={theme} />;
  });

  return (
    <div className={`flex flex-wrap overflow-auto h-full ${theme.text.main}`}>
      <div
        className={`flex flex-col w-1/4 ${theme.background.body} border-r ${theme.border} items-center`}
      >
        {team ? (
          <Left team={team} theme={theme} userid={userCtx?.userData.id!} />
        ) : (
          ""
        )}
      </div>
      <div
        className={`flex flex-col w-1/2 font-thin overflow-hidden ${theme.background.body}`}
      >
        <div
          className={`flex h-28 border-b items-center justify-between ${theme.border}`}
        >
          <p className={`text-3xl mx-12`}>Projects</p>
          <div
            className={`flex text-2xl mx-12 border ${theme.border} rounded-xl py-1 px-6 hover:${theme.background.darker} cursor-pointer`}
          >
            Sort
          </div>
        </div>
        <div className="flex flex-col overflow-hidden">{mapProjects}</div>
      </div>

      <div
        className={`flex flex-col w-1/4 ${theme.background.body} border-l ${theme.border} items-center font-thin`}
      >
        <div className="flex flex-col w-2/3 sticky top-0 items-center">
          <p className="my-5 text-2xl">Online Members</p>
          {mapOnlineUsers}
        </div>
      </div>
    </div>
  );
}

const AdminSettings = ({
  theme,
  team,
}: {
  theme: ThemeInterface;
  team: TeamInterface;
}) => {
  const [createproject, setCreateproject] = useState(false);

  return (
    <div className="flex flex-col">
      <button
        className={`flex ${theme.buttonColor} py-2 px-10 rounded-lg my-1 justify-center`}
        onClick={() => {
          if (createproject) {
            setCreateproject(false);
          } else {
            setCreateproject(true);
          }
        }}
      >
        Create new Project
      </button>
      {createproject ? <CreateProject theme={theme} team={team} /> : ""}
      <button
        className={`flex border rounded-xl py-1 px-6 hover:${theme.background.light} ${theme.profile} py-2 px-10 rounded-lg my-1 justify-center`}
      >
        Settigns
      </button>
    </div>
  );
};

function compare(arr1: any, arr2: any) {
  if (!arr1 || !arr2) return;

  let result;

  arr1.forEach((e1: any, i: any) =>
    arr2.forEach((e2: any) => {
      if (e1.length > 1 && e2.length) {
        result = compare(e1, e2);
      } else if (e1 !== e2) {
        result = false;
      } else {
        result = true;
      }
    })
  );

  return result;
}

export const Left = ({
  team,
  theme,
  userid,
}: {
  team: TeamInterface;
  theme: ThemeInterface;
  userid: string;
}) => {
  return (
    <div className="flex flex-col w-2/3 sticky top-0">
      <div className="flex flex-col items-center my-8">
        {team ? (
          <img
            src={URL.createObjectURL(
              new Blob([new Uint8Array(team.image!.data)])
            )}
            alt="logo"
            className={`flex h-32 w-32 object-cover rounded-full border ${theme.profile}`}
          />
        ) : (
          ""
        )}
        <div className={`flex flex-col font-thin items-center`}>
          <p className={`text-3xl text-center`}>{team?.displayname}</p>
          <p className={`text-lg ${theme.text.secondary}`}>#{team?.name}</p>
        </div>
      </div>
      {team?.admins.includes(userid) ? (
        <AdminSettings theme={theme} team={team} />
      ) : (
        ""
      )}
      <div className="flex flex-col my-4 font-thin">
        <p className="text-center mb-3 text-2xl">Description</p>
        <div className="border-t"></div>
        <p className="my-2 text-md">{team?.description.desc}</p>
        <div className="border-t"></div>
      </div>
    </div>
  );
};

const CreateProject = ({
  theme,
  team,
}: {
  theme: ThemeInterface;
  team: TeamInterface;
}) => {
  const [dates, setDates] = useState() as any;
  const [name, setName] = useState<string>();
  const [desc, setDesc] = useState<string>();
  const [toggleMembers, setToggleMembers] = useState(false);
  const [toggleAdmins, setToggleAdmins] = useState(false);
  const [members, setMembers] = useState<string[]>([]);
  const [admins, setAdmins] = useState<string[]>([]);

  const CalRange = () => {
    return (
      <div className="flex flex-col w-full">
        <label className="ml-1">Select date range</label>
        <DateTimeRangePicker
          onChange={setDates}
          value={dates}
          disableClock={true}
          className="flex flex-col"
        />
      </div>
    );
  };
  const CreateProject = async () => {
    if (name) {
      const newProject = {
        name,
        teamid: team.id,
        desc,
        dates,
        members: toggleMembers
          ? members
            ? members
            : team.members
          : team.members,
        admins: toggleAdmins ? (admins ? admins : team.admins) : team.admins,
      };

      await axios.post(`${baseurl}/projects/create`, newProject, {
        withCredentials: true,
      });

      window.location.reload();
    }
  };
  return (
    <div className="flex flex-col border w-full font-thin rounded my-2">
      <p className="text-xl text-center my-2 ">Create new project</p>
      <div className="flex flex-col w-full">
        <label className="text-lg ml-1">Project Name</label>
        <input
          type="text"
          placeholder="project name"
          className={`appearance-none border w-full py-2 px-3 text-grey-darker ${theme.background.main} ${theme.border}`}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
            setName(e.target.value)
          }
        />
      </div>
      <div className="flex flex-col w-full">
        <label className="text-lg ml-1">Description</label>
        <textarea
          placeholder="project description"
          className={`appearance-none border w-full py-2 px-3 text-grey-darker ${theme.background.main} ${theme.border}`}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void =>
            setDesc(e.target.value)
          }
        />
      </div>
      <div className="flex flex-col">
        <label className="text-lg ml-1">Specify Members</label>
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
      <div className="flex flex-col">
        <label className="text-lg ml-1">Specify Admins</label>
        <ToggleButton value={toggleAdmins} onChange={setToggleAdmins} />
        {toggleAdmins && (
          <div className="border-t border-b">
            <UserSelector
              ids={team.admins}
              selected={admins}
              setSelected={setAdmins}
            />
          </div>
        )}
      </div>
      <CalRange />
      <button
        className={`flex ${theme.buttonColor} py-2 px-10 mt-12 justify-center`}
        onClick={() => CreateProject()}
      >
        Submit
      </button>
    </div>
  );
};
