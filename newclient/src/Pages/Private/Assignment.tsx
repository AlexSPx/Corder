import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Light } from "../../ColorTheme";
import FileAdder from "../../Components/Private/FileAdder";
import FileCard from "../../Components/Private/FileCard";
import { DateActive, DateInactive } from "../../Components/Private/ProjectCard";
import useTPAQuery from "../../Components/Private/Queries/useTPAQuery";
import { ThemeContext } from "../../Context/ThemeContext";
import { UserContext } from "../../Context/UserContext";
import {
  AssignmentInterface,
  FileInterface,
  ThemeInterface,
} from "../../Interfaces";
import { baseurl } from "../../routes";

export default function Assignment() {
  const { name, assignment: assignmentname } = useParams() as any;

  const userCtx = useContext(UserContext);
  const themeCtx = useContext(ThemeContext);
  const theme =
    themeCtx?.themeData.data === undefined ? Light : themeCtx.themeData.data;

  const [assignment, setAssignment] = useState<AssignmentInterface>();
  const [files, setFiles] = useState<FileInterface[]>();

  useTPAQuery({
    option: "Assignment",
    amount: "One",
    team: name,
    name: assignmentname,
    setData: setAssignment,
  });

  useEffect(() => {
    const fetchFiles = async () => {
      const files = await axios.post<FileInterface[]>(
        `${baseurl}/files/fetchfiles/`,
        { ids: assignment?.files },
        { withCredentials: true }
      );

      setFiles(files.data);
    };

    fetchFiles();
  }, [assignment]);

  return (
    <div className={`flex flex-wrap overflow-auto h-full ${theme.text.main}`}>
      <div
        className={`flex flex-col w-1/4 ${theme.background.body} border-r ${theme.border} items-center`}
      >
        {assignment ? <Left assignment={assignment} theme={theme} /> : ""}
      </div>
      <div
        className={`w-1/2 font-thin overflow-hidden ${theme.background.body}`}
      >
        {files && userCtx?.userData ? <Main files={files} theme={theme} /> : ""}
      </div>
      <div
        className={`flex flex-col w-1/4 h-full ${theme.background.body} border-l ${theme.border} items-center`}
      >
        {assignment ? <Right assignment={assignment} theme={theme} /> : ""}
      </div>
    </div>
  );
}

const Left = ({
  assignment,
  theme,
}: {
  assignment: AssignmentInterface;
  theme: ThemeInterface;
}) => {
  const dateCheck =
    assignment.range === null
      ? true
      : Date.parse(assignment.range[0]) < Date.now()
      ? Date.parse(assignment.range[1]) > Date.now()
        ? true
        : false
      : false;

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
    <div className="flex flex-col w-2/3 sticky top-0 font-thin items-center ">
      <div className="flex text-3xl my-8 text-center">{assignment.name}</div>
      <div className="flex flex-row w-full justify-between mt-3 text-xl items-center  border-b border-t py-2">
        <div className="flex flex-col ml-4 items-center">
          Status {dateCheck ? <DateActive /> : <DateInactive />}
        </div>
        <div className="flex flex-col mr-4 items-center">
          Finished? <p>{assignment.status ? "Yes" : "No"}</p>
        </div>
      </div>
      <div className="flex flex-col border-b w-full items-center py-2">
        <p className="text-xl">Description</p>
        <p className={`${theme.text.secondary}`}>{assignment.description}</p>
      </div>
      {!assignment.status && !inTime ? (
        "Nothing submited"
      ) : (
        <>
          <div className="flex mt-3 text-lg">Latest submit: {date}</div>
          <div className="flex">
            {!inTime && <p className="text-lg">Submited late</p>}
          </div>
        </>
      )}
    </div>
  );
};

const Main = ({
  files,
  theme,
}: {
  files: FileInterface[];
  theme: ThemeInterface;
}) => {
  const mapFiles = files.map((file) => {
    return <FileCard file={file} theme={theme} />;
  });

  return <div className="flex flex-col w-full overflow-auto">{mapFiles}</div>;
};

const Right = ({
  assignment,
  theme,
}: {
  assignment: AssignmentInterface;
  theme: ThemeInterface;
}) => {
  return (
    <div className="flex flex-col w-2/3 sticky top-0 font-thin items-center justify-center">
      <div className="flex w-full items-center justify-center">
        <FileAdder theme={theme} assignment={assignment} />
      </div>
    </div>
  );
};
