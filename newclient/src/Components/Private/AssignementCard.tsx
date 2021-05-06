import React from "react";
import { useHistory } from "react-router-dom";
import { AssignemntInterface, ThemeInterface } from "../../Interfaces";
import { DateActive, DateInactive } from "./ProjectCard";

export default function AssignementCard({
  assignment,
  theme,
  teamname,
  projectname,
  userid,
}: {
  assignment: AssignemntInterface;
  theme: ThemeInterface;
  teamname: string;
  projectname: string;
  userid: string;
}) {
  const dateCheck =
    assignment.range === null
      ? true
      : Date.parse(assignment.range[0]) < Date.now()
      ? Date.parse(assignment.range[1]) > Date.now()
        ? true
        : false
      : false;

  const history = useHistory();
  const goto = (to: string) => history.push(to);

  const forMe = assignment.members.includes(userid) ? "bg-blue-50" : "";

  if (forMe) {
    return (
      <div
        className={`flex flex-col h-28 border-b ${theme.border} ${
          forMe ? `hover:bg-blue-100` : `hover:${theme.background.darker}`
        } w-full ${forMe}`}
      >
        <div className="flex flex-col h-full justify-center">
          <div className="flex flex-row mb-4 mx-5 align-center justify-between">
            <div className={`flex flex-col justify-center`}>
              <div className="flex">
                {dateCheck ? <DateActive /> : <DateInactive />}
                <p
                  className={`text-xl mx-3 cursor-pointer`}
                  onClick={() =>
                    goto(
                      `../../${teamname}/project/${projectname}/${assignment.name}`
                    )
                  }
                >
                  {assignment.name}
                </p>
              </div>
              <p className={`mx-2 text-lg italic`}>
                Status: {assignment.status ? "Ready" : "Not ready"}
              </p>
            </div>
            <div
              className={`flex flex-col text-lg w-1/3 h-full items-center border-l border-r`}
            >
              <p className="text-xl">Description</p>
              <p className="text-md text-center">{assignment.description}</p>
            </div>
          </div>
          <div className="flex mx-5 justify-between"></div>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
}
