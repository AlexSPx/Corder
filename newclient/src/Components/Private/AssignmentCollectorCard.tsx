import React from "react";
import { useHistory } from "react-router-dom";
import {
  AssignmentInterface,
  AssignmentsCollectorInterface,
  ThemeInterface,
} from "../../Interfaces";

export default function AssignmentCollectorCard({
  teamname,
  projectname,
  collector,
  assignments,
  theme,
}: {
  teamname: string;
  projectname: string;
  collector: AssignmentsCollectorInterface;
  assignments: AssignmentInterface[];
  theme: ThemeInterface;
}) {
  const history = useHistory();
  const goto = (to: string) => history.push(to);

  const all = collector.assignments.length;
  let done = 0;

  assignments.forEach((assg) => {
    if (collector.assignments.includes(assg.id)) {
      if (assg.status === true) {
        done += 1;
      }
    }
  });

  return (
    <div className={`flex flex-col h-28 border-b ${theme.border} w-full`}>
      <div className="flex flex-col h-full justify-center">
        <div className="flex flex-row mb-4 mx-5 align-center justify-between">
          <div className={`flex flex-col justify-center`}>
            <div className="flex">
              <p
                className={`text-xl mx-3 cursor-pointer`}
                onClick={() =>
                  goto(
                    `../../${teamname}/project/${projectname}/fe/${collector.name}`
                  )
                }
              >
                {collector.name}
              </p>
            </div>
            <p className={`mx-4 text-lg italic`}>
              Status: {collector.status ? "Ready" : "Not ready"}
            </p>
            <p className="mx-4">{`${done}/${all} Submited`}</p>
          </div>
          <div
            className={`flex flex-col text-lg w-1/3 h-full items-center border-l border-r`}
          >
            <p className="text-xl">Description</p>
            <p className="text-md text-center">{collector.description}</p>
          </div>
        </div>
        <div className="flex mx-5 justify-between"></div>
      </div>
    </div>
  );
}
