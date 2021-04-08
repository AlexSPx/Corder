import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Light } from "../../ColorTheme";
import ProjectCard from "../../Components/Private/ProjectCard";
import { ThemeContext } from "../../Context/ThemeContext";
import { UserContext } from "../../Context/UserContext";
import { ProjectInterface } from "../../Interfaces";
import { Collection } from "../../public/SmallSvgs";
import { baseurl } from "../../routes";

export default function Main() {
  const themeCtx = useContext(ThemeContext);
  const userCtx = useContext(UserContext);

  const theme =
    themeCtx?.themeData.data === undefined ? Light : themeCtx.themeData.data;

  const [projects, setProjects] = useState<ProjectInterface[]>();

  useEffect(() => {
    const fetchProjects = async () => {
      const projects = await axios.post<ProjectInterface[]>(
        `${baseurl}/projects/fetchprojectsbymembers`,
        {},
        { withCredentials: true }
      );
      setProjects(projects.data);
    };

    fetchProjects();
  }, []);

  const mapProjects = projects?.map((project) => {
    return (
      <ProjectCard
        project={project}
        theme={theme}
        key={project.id.toString()}
      />
    );
  });

  return (
    <div className={`flex flex-wrap overflow-hidden h-full ${theme.text.main}`}>
      <div
        className={`flex flex-col w-1/4 overflow-hidden ${theme.background.body} border-r ${theme.border} items-center`}
      >
        <div className="flex flex-col w-2/3">
          <div className="flex flex-row my-8">
            <img
              src={userCtx?.userData.avatar}
              alt="avatar"
              className={`flex h-14 w-14 bg-cover rounded-full border ${theme.profile}`}
            />
            <div className={`flex flex-col font-thin`}>
              <p className={`text-lg ml-3`}>{userCtx?.userData.name}</p>
              <p className={`text-md ml-3 ${theme.text.secondary}`}>
                @{userCtx?.userData.username}
              </p>
            </div>
          </div>
          <button
            className={`flex ${theme.buttonColor} py-2 px-10 rounded-lg my-1 justify-center`}
          >
            Create new Team
          </button>
          <button
            className={`flex border rounded-xl py-1 px-6 hover:${theme.background.darker} ${theme.profile} py-2 px-10 rounded-lg my-1 justify-center`}
          >
            Join a Team
          </button>
          <div className="flex flex-col my-4">
            <div className="flex flex-row mb-1">
              <Collection />
              <p className="mx-2">Projects: {projects?.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`w-1/2 font-thin overflow-hidden ${theme.background.body}`}
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
        {mapProjects}
      </div>

      <div
        className={`w-1/4 overflow-hidden ${theme.background.body} border-l ${theme.border}`}
      ></div>
    </div>
  );
}
