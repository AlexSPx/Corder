import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Light } from "../../ColorTheme";
import { ThemeContext } from "../../Context/ThemeContext";
import { UserContext } from "../../Context/UserContext";
import {
  AssignemntInterface,
  AssignmentsCollectorInterface,
  ProjectInterface,
  ThemeInterface,
} from "../../Interfaces";
import { baseurl } from "../../routes";
import { Circle } from "rc-progress";
import AssignementCard from "../../Components/Private/AssignementCard";
import { DateActive, DateInactive } from "../../Components/Private/ProjectCard";
import DropdownSelector from "../../Components/Private/DropdownSelector";
import { AssignmentForm } from "../../Components/Private/AssignmentForm";
import AssignmentCollectorCard from "../../Components/Private/AssignmentCollectorCard";

export default function Project() {
  const { name, projectname } = useParams() as any;

  const themeCtx = useContext(ThemeContext);
  const userCtx = useContext(UserContext);

  const theme =
    themeCtx?.themeData.data === undefined ? Light : themeCtx.themeData.data;

  const [project, setProject] = useState<ProjectInterface>();
  const [assignments, setAssignments] = useState<AssignemntInterface[]>();
  const [collectorAssignment, setCollectorAssignment] = useState<
    AssignmentsCollectorInterface[]
  >();

  useEffect(() => {
    const fetchProject = async () => {
      const projectRes = await axios.get<ProjectInterface>(
        `${baseurl}/projects/fetchproject/${name}/${projectname}`,
        { withCredentials: true }
      );

      setProject(projectRes.data);
    };

    fetchProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const fetchAssignments = async () => {
      const assignments = await axios.post<AssignemntInterface[]>(
        `${baseurl}/assignment/fetchassignments`,
        { projectID: project?.id, userID: userCtx?.userData.id },
        { withCredentials: true }
      );

      setAssignments(assignments.data);
    };

    const fetchAssignmentsAdmin = async () => {
      const assignments = await axios.get(
        `${baseurl}/assignment/fetchassignments/admin/${project?.id}`,
        { withCredentials: true }
      );

      console.log(assignments.data);

      setAssignments(assignments.data.assignments);
      setCollectorAssignment(assignments.data.collectors);
    };

    if (project?.admins[0].includes(userCtx!.userData.id)) {
      console.log("admin");

      fetchAssignmentsAdmin();
    } else {
      console.log("regular");

      fetchAssignments();
    }
  }, [project]);

  const percentagedone = () => {
    if (assignments) {
      const all: number = assignments?.length;
      let done = 0;

      assignments?.forEach((assignment) => {
        if (assignment.status) {
          done++;
        }
      });
      if (done === 0) {
        return 0;
      }
      return Math.round((done / all) * 100);
    }
    return 0;
  };

  return (
    <div className={`flex flex-wrap overflow-auto h-full ${theme.text.main}`}>
      <div
        className={`flex flex-col w-1/4 ${theme.background.body} border-r ${theme.border} items-center `}
      >
        {project ? (
          <Left project={project} theme={theme} percentage={percentagedone()} />
        ) : (
          ""
        )}
      </div>
      <div className={`flex flex-col w-1/2 font-thin ${theme.background.body}`}>
        {assignments && userCtx?.userData ? (
          <Main
            assignments={assignments}
            collectors={collectorAssignment}
            theme={theme}
            teamname={name}
            projectname={projectname}
            userid={userCtx?.userData.id}
          />
        ) : (
          ""
        )}
      </div>
      <div
        className={`flex flex-col w-1/4 ${theme.background.body} border-l ${theme.border} items-center`}
      >
        {project && userCtx?.userData ? (
          <Right project={project} userid={userCtx.userData.id} theme={theme} />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

const Left = ({
  project,
  theme,
  percentage,
}: {
  project: ProjectInterface;
  theme: ThemeInterface;
  percentage: number;
}) => {
  const dateCheck =
    project.range === null
      ? true
      : Date.parse(project.range[0][0]) < Date.now()
      ? Date.parse(project.range[0][1]) > Date.now()
        ? true
        : false
      : false;

  return (
    <div className="flex flex-col w-2/3 font-thin items-center sticky top-0">
      <div className="flex text-3xl my-8">{project.name}</div>
      <div className="flex flex-row w-full justify-between mt-3 text-xl items-center  border-b border-t py-2">
        <div className="flex flex-col ml-4 items-center">
          Status {dateCheck ? <DateActive /> : <DateInactive />}
        </div>
        <div className="flex flex-col mr-4 items-center">
          Finished? <p>{project.status ? "Yes" : "No"}</p>
        </div>
      </div>
      <div className="flex flex-col border-b w-full items-center py-2">
        <p className="text-xl">Description</p>
        <p className={`${theme.text.secondary}`}>{project.desc}</p>
      </div>
      <p className="text-2xl my-3">Progress</p>
      <Circle
        percent={percentage}
        strokeWidth={1}
        strokeColor="#8c9ba7"
        trailColor="#dfe9ec"
      />
    </div>
  );
};

const Main = ({
  assignments,
  collectors,
  theme,
  teamname,
  projectname,
  userid,
}: {
  assignments: AssignemntInterface[];
  collectors?: AssignmentsCollectorInterface[];
  theme: ThemeInterface;
  teamname: string;
  projectname: string;
  userid: string;
}) => {
  const mapAssignemnts = assignments.map((assignemnt) => {
    return (
      <AssignementCard
        assignment={assignemnt}
        theme={theme}
        teamname={teamname}
        projectname={projectname}
        userid={userid}
      />
    );
  });

  let mapCollectors;
  if (collectors) {
    mapCollectors = collectors.map((collector) => {
      return (
        <AssignmentCollectorCard
          collector={collector}
          teamname={teamname}
          projectname={projectname}
          theme={theme}
          assignments={assignments}
        />
      );
    });
  }

  return (
    <div className="flex flex-col">
      {mapCollectors}
      {mapAssignemnts}
    </div>
  );
};

const Right = ({
  project,
  userid,
  theme,
}: {
  project: ProjectInterface;
  userid: string;
  theme: ThemeInterface;
}) => {
  return (
    <div className="flex flex-col w-3/4 items-center">
      {project.admins[0].includes(userid) ? (
        <AdminSettings project={project} userid={userid} theme={theme} />
      ) : (
        ""
      )}
    </div>
  );
};

const AdminSettings = ({
  project,
  userid,
  theme,
}: {
  project: ProjectInterface;
  userid: string;
  theme: ThemeInterface;
}) => {
  const [createassignment, setCreateassignment] = useState<boolean>();

  return (
    <div className="flex flex-col w-5/6 mt-6">
      <button
        className={`flex ${theme.buttonColor} py-2 px-10 rounded-lg my-1 justify-center`}
        onClick={() => {
          if (createassignment) {
            setCreateassignment(false);
          } else {
            setCreateassignment(true);
          }
        }}
      >
        Create new Assignment
      </button>
      {createassignment ? (
        <CreateAssignment project={project} theme={theme} />
      ) : (
        ""
      )}
      <button
        className={`flex border rounded-xl py-1 px-6 hover:${theme.background.light} ${theme.profile} py-2 px-10 rounded-lg my-1 justify-center`}
      >
        Settigns
      </button>
    </div>
  );
};

const CreateAssignment = ({
  project,
  theme,
}: {
  project: ProjectInterface;
  theme: ThemeInterface;
}) => {
  const CreateGroupAssignment = async () => {
    const newAssignment = {
      teamID: project.teamID,
      projectID: project.id,
      name,
      range: dates,
      members: members ? members : project.members[0],
      admins: project.admins[0],
      desc,
      status: false,
    };

    const res = await axios.post(
      `${baseurl}/assignment/create`,
      newAssignment,
      { withCredentials: true }
    );
    if (res.data) {
      window.location.reload();
    }
  };
  const CreateForeachAssignment = async () => {
    const newAssignment = {
      teamID: project.teamID,
      projectID: project.id,
      name,
      range: dates,
      members: members ? members : project.members[0],
      admins: project.admins[0],
      desc,
      status: false,
    };

    const res = await axios.post(
      `${baseurl}/assignment/createforeach`,
      newAssignment,
      { withCredentials: true }
    );
    if (res.data) {
      window.location.reload();
    }
  };

  const [option, setOption] = useState<string>();
  const [members, setMembers] = useState<string[]>();
  const [name, setName] = useState<string>();
  const [desc, setDesc] = useState<string>();
  const [dates, setDates] = useState<
    Date | [(Date | undefined)?, (Date | undefined)?] | null | undefined
  >();

  return (
    <div className="flex flex-col border w-full font-thin rounded my-2">
      <p className="text-xl text-center my-2 ">Create new assigment</p>
      <DropdownSelector
        options={["group", "copy for each"]}
        selected={option}
        setSelector={setOption}
      />
      {option ? (
        <AssignmentForm
          theme={theme}
          project={project}
          members={members!}
          dates={dates}
          setMembers={setMembers}
          setName={setName}
          setDesc={setDesc}
          setDates={setDates}
        />
      ) : (
        <div className="flex w-full justify-center mt-3">
          <p className="italic text-lg">Select an option...</p>
        </div>
      )}
      <button
        className={`flex ${theme.buttonColor} py-2 px-10 mt-12 justify-center`}
        onClick={() => {
          switch (option) {
            case "group":
              CreateGroupAssignment();
              break;

            case "copy for each":
              CreateForeachAssignment();
              break;

            default:
              break;
          }
        }}
      >
        Submit
      </button>
    </div>
  );
};
