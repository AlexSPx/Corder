import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Light } from "../../ColorTheme";
import FileAdder from "../../Components/Private/FileAdder";
import FileCard from "../../Components/Private/FileCard";
import { DateActive, DateInactive } from "../../Components/Private/ProjectCard";
import { ThemeContext } from "../../Context/ThemeContext";
import { UserContext } from "../../Context/UserContext";
import {
  AssignemntInterface,
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

  const [assignment, setAssignment] = useState<AssignemntInterface>();
  const [files, setFiles] = useState<FileInterface[]>();

  useEffect(() => {
    const fetchAssignment = async () => {
      const assignmentRes = await axios.get<AssignemntInterface>(
        `${baseurl}/assignment/fetchassignment/${name}/${assignmentname}`,
        { withCredentials: true }
      );
      if (assignmentRes.data) {
        setAssignment(assignmentRes.data);
      }
    };

    fetchAssignment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  assignment: AssignemntInterface;
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
  assignment: AssignemntInterface;
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
