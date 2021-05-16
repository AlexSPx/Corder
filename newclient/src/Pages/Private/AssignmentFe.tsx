import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { Light } from "../../ColorTheme";
import { DateActive, DateInactive } from "../../Components/Private/ProjectCard";
import { ThemeContext } from "../../Context/ThemeContext";
import {
  AssignmentsCollectorInterface,
  CollectorAdminInterface,
  AssignmentInterface,
  SingleUser,
  ThemeInterface,
} from "../../Interfaces";
import { baseurl } from "../../routes";

export default function AssignmentFe() {
  const themeCtx = useContext(ThemeContext);

  const theme =
    themeCtx?.themeData.data === undefined ? Light : themeCtx.themeData.data;

  const { name, projectname, collector: collectorname } = useParams() as any;

  const [collector, setCollector] = useState<AssignmentsCollectorInterface>();
  const [assignments, setAssignments] = useState<AssignmentInterface[]>();
  const [users, setUsers] = useState<SingleUser[]>();

  useEffect(() => {
    const fetchAssignments = async () => {
      const res = await axios.get<CollectorAdminInterface>(
        `${baseurl}/assignment/fetchfe/${name}/${collectorname}`,
        { withCredentials: true }
      );
      setCollector(res.data.collector);
      setAssignments(res.data.assignments);
    };

    fetchAssignments();
  }, [name, collectorname]);

  useEffect(() => {
    const fetchUsers = async () => {
      const ids: string[] = [];
      assignments?.forEach((assg) => {
        ids.push(assg.members[0]);
      });

      const resUsers = await axios.post(
        `${baseurl}/teams/fetchteammembers`,
        { ids },
        { withCredentials: true }
      );
      setUsers(resUsers.data);
    };
    fetchUsers();
  }, [collector, assignments]);

  const all = assignments?.length;
  let done = 0;

  assignments?.forEach((assg) => {
    if (assg.status === true) {
      done++;
    }
  });

  const mapAssignments = assignments?.map((assg) => {
    if (users) {
      const user = users.filter(
        (user: SingleUser) => user.id === assg.members[0]
      )[0];
      if (user) {
        return (
          <CollectorAssignment
            assignment={assg}
            user={user}
            theme={theme}
            team={name}
            project={projectname}
          />
        );
      }
    }
    return "";
  });

  return (
    <div className={`flex flex-col w-full h-full ${theme.background.body}`}>
      <div
        className={`flex w-full h-12 px-24 py-9 items-center justify-between border-b ${theme.border} font-thin`}
      >
        <p className="text-2xl">{collector?.name}</p>
        <div className="flex text-xl">
          Submited:{done}/{all}
        </div>
      </div>
      <div className="flex flex-col w-full h-full items-center">
        <p className="flex font-thin my-6 text-xl">Assignments</p>
        <div
          className={`flex flex-col w-5/6 max-h-(screen-8) border overflow-auto ${theme.border}`}
          id="journal-scroll"
        >
          <div className="flex flex-col">{mapAssignments}</div>
        </div>
      </div>
    </div>
  );
}

const CollectorAssignment = ({
  assignment,
  user,
  team,
  project,
  theme,
}: {
  assignment: AssignmentInterface;
  user: SingleUser;
  team: string;
  project: string;
  theme: ThemeInterface;
}) => {
  // const dateCheck =
  //   assignment.range === null
  //     ? true
  //     : Date.parse(assignment.range[0]) < Date.now()
  //     ? Date.parse(assignment.range[1]) > Date.now()
  //       ? true
  //       : false
  //     : false;

  const date = assignment.submits
    ? new Date(
        parseInt(assignment.submits[assignment.submits.length - 1])
      ).toLocaleDateString([], { hour: "2-digit", minute: "2-digit" })
    : false;

  const lastSubmit = () => {
    if (assignment.submits) {
      if (assignment.submits.length > 0) {
        if (assignment.submits.length % 2 === 0) {
          return assignment.submits.length;
        } else {
          return assignment.submits.length - 1;
        }
      }
      return 0;
    }
    return -1;
  };

  const inTime =
    lastSubmit() !== -1
      ? assignment.range === null
        ? true
        : Date.parse(assignment.submits[lastSubmit()]) <
          Date.parse(assignment.range[1])
        ? true
        : false
      : false;

  return (
    <div
      className={`flex flex-row h-20 border-b justify-center items-center ${theme.border} px-6`}
    >
      <div
        className={`flex flex-row items-center h-full border-r ${theme.border} w-1/4`}
      >
        <img
          src={URL.createObjectURL(
            new Blob([new Uint8Array(user.avatar.data)])
          )}
          alt={user.name}
          className={`flex h-14 w-14 bg-cover rounded-full border cursor-pointer ${theme.profile}`}
        />
        <div className="flex flex-col mx-2">
          <p>{user.name}</p>
          <p className={`${theme.text.secondary} italic`}>@{user.username}</p>
        </div>
      </div>
      <div
        className={`flex items-center h-full border-r ${theme.border} justify-center w-1/4`}
      >
        {assignment.status ? (
          <div className="flex flex-col items-center">
            <DateActive />
            <p>Submited</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <DateInactive />
            <p>Not Submited</p>
          </div>
        )}
      </div>
      <div
        className={`flex flex-col items-center h-full border-r ${theme.border} justify-center w-1/4`}
      >
        {inTime && assignment.status ? (
          <div className="flex flex-col items-center">
            <DateActive />
            <p>On time</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <DateInactive />
            <p>Late</p>
          </div>
        )}
        <p>{assignment.submits ? date : ""}</p>
      </div>
      <div
        className={`flex items-center h-full text-center justify-center w-1/4`}
      >
        <Link
          className={`py-2 w-2/3 border rounded-lg ${theme.profile} hover:${theme.background.light}`}
          to={`/${team}/project/${project}/${assignment.name}/${assignment.id}`}
          target="_blank"
        >
          Open
        </Link>
      </div>
    </div>
  );
};
