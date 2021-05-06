import axios from "axios";
import React, { useState } from "react";
import { AssignemntInterface, ThemeInterface } from "../../Interfaces";
import { FileAddIcon } from "../../public/SmallSvgs";
import { baseurl } from "../../routes";

export default function FileAdder({
  theme,
  assignment,
}: {
  theme: ThemeInterface;
  assignment: AssignemntInterface;
}) {
  const [dropdown, setDropdown] = useState(false);
  const [attachfile, setAttachfile] = useState(false);
  const [addlink, setAddlink] = useState(false);

  return (
    <div className="flex flex-col w-full mt-3">
      <div
        className={`flex flex-col w-full items-center justify-center rounded border ${theme.profile} ring-opacity-5 py-8 px-6`}
      >
        <p className="flex self-start mt-3  text-lg">Subbmit work</p>
        <AddItemButton
          theme={theme}
          dropdown={dropdown}
          setDropdown={setDropdown}
          attachfile={attachfile}
          setAttachfile={setAttachfile}
          addlink={addlink}
          setAddlink={setAddlink}
        />
        <button
          className={`flex border ${theme.buttonColor} w-full rounded-md p-2 justify-center my-2`}
        >
          <p>Mark as done</p>
        </button>
      </div>
      {attachfile && (
        <AttachFile
          theme={theme}
          status={attachfile}
          setStatus={setAttachfile}
          assignment={assignment}
        />
      )}
      {addlink && (
        <Addlink
          theme={theme}
          status={addlink}
          setStatus={setAddlink}
          assignment={assignment}
        />
      )}
    </div>
  );
}

const AddItemButton = ({
  theme,
  dropdown,
  setDropdown,
  attachfile,
  setAttachfile,
  addlink,
  setAddlink,
}: {
  theme: ThemeInterface;
  dropdown: boolean;
  setDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  attachfile: boolean;
  setAttachfile: React.Dispatch<React.SetStateAction<boolean>>;
  addlink: boolean;
  setAddlink: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <>
      <div className="inline-block w-full">
        <button
          className={`inline-flex border ${theme.profile} w-full rounded-md p-2 justify-center hover:${theme.background.light} my-2`}
          onClick={() => setDropdown(!dropdown)}
        >
          <p className="text-center">Add or Create file</p>
        </button>
        {dropdown && (
          <Dropmenu
            attachfile={attachfile}
            setAttachfile={setAttachfile}
            dropdown={dropdown}
            setDropdown={setDropdown}
            addlink={addlink}
            setAddlink={setAddlink}
          />
        )}
      </div>
    </>
  );
};

const Dropmenu = ({
  attachfile,
  setAttachfile,
  dropdown,
  setDropdown,
  addlink,
  setAddlink,
}: {
  attachfile: boolean;
  setAttachfile: React.Dispatch<React.SetStateAction<boolean>>;
  dropdown: boolean;
  setDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  addlink: boolean;
  setAddlink: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div
      className="origin-top-right absolute left-0 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none ml-6"
      role="menu"
      tabIndex={-1}
    >
      <div className="py-1" role="none">
        <p
          className="text-gray-700 block px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 hover:text-gray-900"
          role="menuitem"
          tabIndex={-1}
          id="menu-item-0"
          onClick={() => {
            setAttachfile(!attachfile);
            setDropdown(!dropdown);
          }}
        >
          Attach file
        </p>
        <p
          className="text-gray-700 block px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 hover:text-gray-900"
          role="menuitem"
          tabIndex={-1}
          onClick={() => {
            setAddlink(!addlink);
            setDropdown(!dropdown);
          }}
          id="menu-item-1"
        >
          Add a link
        </p>
        <p
          className="text-gray-700 block px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 hover:text-gray-900"
          role="menuitem"
          tabIndex={-1}
          id="menu-item-2"
        >
          Document
        </p>
      </div>
    </div>
  );
};

const AttachFile = ({
  theme,
  status,
  setStatus,
  assignment,
}: {
  theme: ThemeInterface;
  status: boolean;
  setStatus: React.Dispatch<React.SetStateAction<boolean>>;
  assignment: AssignemntInterface;
}) => {
  const [file, setFile] = useState<Blob | undefined>();

  const handleAcction = async () => {
    if (file) {
      const fileTransfer = new FormData();
      fileTransfer.append("word", file);
      fileTransfer.append("teamid", assignment.teamID[0]);
      fileTransfer.append("assignmentid", assignment.id);

      const res = await axios.post(`${baseurl}/files/saveword`, fileTransfer, {
        withCredentials: true,
      });

      if (res.data) {
        window.location.reload(true);
      }
    }
  };

  return (
    <div
      className={`flex flex-col border ${theme.profile} w-full font-thin rounded my-2 items-center`}
    >
      <p className="text-xl text-center my-2">AttachFile</p>
      <label
        className={`flex flex-row py-3 px-5 group relative  cursor-pointer border ${theme.profile} rounded-md mb-2 items-center`}
      >
        <FileAddIcon css={"w-8 h-8 mx-2"} />
        Attach Docx File
        <input
          type="file"
          accept=".docx, .doc"
          className="hidden"
          onChange={(e: React.ChangeEvent<any>): void =>
            setFile(e.target.files[0])
          }
        />
      </label>

      {file !== undefined && (
        <div
          className={`flex w-5/6 rounded-lg border ${theme.profile} justify-between m-6 p-1`}
        >
          <p className="w-2/3 text-lg truncate">{(file as any).name}</p>
          <button onClick={() => setFile(undefined)}>Remove</button>
        </div>
      )}

      <button
        className={`flex ${theme.buttonColor} py-2 px-10 w-full justify-center`}
        onClick={() => handleAcction()}
      >
        Submit
      </button>
      <div className={`border-b ${theme.border}`}></div>
      <button
        className={`flex ${theme.buttonColor} py-2 px-10 w-full justify-center`}
        onClick={() => setStatus(!status)}
      >
        Cancel
      </button>
    </div>
  );
};

const Addlink = ({
  theme,
  status,
  setStatus,
  assignment,
}: {
  theme: ThemeInterface;
  status: boolean;
  setStatus: React.Dispatch<React.SetStateAction<boolean>>;
  assignment: AssignemntInterface;
}) => {
  const [name, setName] = useState<string>();
  const [newLink, setNewLink] = useState<string>();

  const handleAcction = async () => {
    if (newLink && name) {
      const newLinkData = {
        teamid: assignment.teamID[0],
        assignmentid: assignment.id,
        link: newLink,
        name,
      };

      const res = await axios.post(`${baseurl}/files/newlink`, newLinkData, {
        withCredentials: true,
      });

      if (res.data) {
        window.location.reload();
      }
    }
  };

  return (
    <div
      className={`flex flex-col border ${theme.profile} w-full font-thin rounded my-2 items-center`}
    >
      <p className="text-xl text-center my-2">Add new link</p>
      <div className="flex flex-col w-full">
        <label className="text-lg ml-1">Name</label>
        <input
          type="text"
          placeholder="project name"
          className={`appearance-none border w-full py-2 px-3 text-grey-darker m ${theme.background.main} ${theme.border}`}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
            setName(e.target.value)
          }
        />
      </div>
      <div className="flex flex-col w-full">
        <label className="text-lg ml-1">Link</label>
        <input
          type="text"
          placeholder="project name"
          className={`appearance-none border w-full py-2 px-3 text-grey-darker m ${theme.background.main} ${theme.border}`}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
            setNewLink(e.target.value)
          }
        />
      </div>

      <button
        className={`flex ${theme.buttonColor} py-2 px-10 w-full justify-center mt-2`}
        onClick={() => handleAcction()}
      >
        Submit
      </button>
      <div className={`border-b ${theme.border}`}></div>
      <button
        className={`flex ${theme.buttonColor} py-2 px-10 w-full justify-center`}
        onClick={() => setStatus(!status)}
      >
        Cancel
      </button>
    </div>
  );
};
