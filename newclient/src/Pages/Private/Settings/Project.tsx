import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Light } from "../../../ColorTheme";
import useFetchMembers from "../../../Components/Private/Queries/useFetchMembersQuery";
import useTPAQuery from "../../../Components/Private/Queries/useTPAQuery";
import SendNotification from "../../../Components/Private/Notifications/SendNotification";
import { ThemeContext } from "../../../Context/ThemeContext";
import {
  NotificationInterface,
  ProjectInterface,
  SingleUser,
  ThemeInterface,
} from "../../../Interfaces";
import { DownArrow, UpArrow } from "../../../public/SmallSvgs";
import { Input, TextBox } from "../CreateTeam";
import axios from "axios";
import { baseurl } from "../../../routes";

export default function ProjectSettings() {
  const { name, projectname } = useParams() as any;

  const themeCtx = useContext(ThemeContext);

  const theme =
    themeCtx?.themeData.data === undefined ? Light : themeCtx.themeData.data;

  const [project, setProject] = useState<ProjectInterface>();
  const [projectMembers, setProjectMembers] = useState<SingleUser[]>([]);
  const [projectAdmins, setProjectAdmins] = useState<SingleUser[]>([]);

  const [pName, setPName] = useState<string>();
  const [displayName, setDisplayName] = useState<string>();
  const [desc, setDesc] = useState<string>();
  const [dates, setDates] =
    useState<
      Date | [(Date | undefined)?, (Date | undefined)?] | null | undefined
    >();

  const [notifications, setNotifications] = useState<NotificationInterface[]>(
    []
  );

  useTPAQuery({
    option: "Project",
    amount: "One",
    team: name,
    setData: setProject,
    name: projectname,
  });

  const { members } = useFetchMembers(project?.members! as any);
  useEffect(() => {
    setPName(project?.name);
    setDesc(project?.desc);
    if (project?.displayname) {
      setDisplayName(project?.displayname);
    }
    if (
      project?.range &&
      DateCheck(new Date(project?.range[0] as any)) &&
      DateCheck(new Date(project?.range[1] as any))
    ) {
      setDates([
        new Date(project?.range[0] as any),
        new Date(project?.range[1] as any),
      ]);
    }
  }, [project]);

  useEffect(() => {
    setProjectMembers([]);
    setProjectAdmins([]);
    members?.forEach((member) => {
      if (project?.admins.includes(member.id)) {
        if (!projectAdmins.includes(member)) {
          setProjectAdmins((admins: any) => [...admins, member]);
        }
      } else {
        if (!projectMembers.includes(member)) {
          setProjectMembers((members: any) => [...members, member]);
        }
      }
    });
  }, [members]);

  const saveChanges = async () => {
    // axios.post(`${baseurl}/project`)
    const members: string[] = [];
    const admins: string[] = [];
    projectMembers.forEach((mmbr) => members.push(mmbr.id));
    projectAdmins.forEach((admin) => {
      members.push(admin.id);
      admins.push(admin.id);
    });

    const changes = {
      name: pName,
      displayname: displayName,
      members,
      admins,
      range: dates ? dates : null,
    };

    const res = await axios.post(
      `${baseurl}/projects/changes`,
      { changes, id: project?.id },
      { withCredentials: true }
    );
  };

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

  const mapMembers = projectMembers?.map((mmbr) => {
    return (
      <Member
        user={mmbr}
        theme={theme}
        members={projectMembers}
        setProjectMembers={setProjectMembers}
        admins={projectAdmins}
        setProjectAdmins={setProjectAdmins}
      />
    );
  });
  const mapAdmins = projectAdmins?.map((mmbr) => {
    return (
      <Admin
        user={mmbr}
        theme={theme}
        members={projectMembers}
        setProjectMembers={setProjectMembers}
        admins={projectAdmins}
        setProjectAdmins={setProjectAdmins}
      />
    );
  });

  return (
    <div
      className={`flex flex-col h-full w-full ${theme.background.body} ${theme.text.main} items-center font-thin`}
    >
      <SendNotification
        notifications={notifications}
        setNotifications={setNotifications}
      />
      <div className="flex">
        <p className="text-3xl mt-6">{project?.name}</p>
      </div>
      <div className="flex flex-row items-center justify-center w-full mt-3">
        <div className="flex flex-col w-1/2 items-center">
          <div className="flex flex-col w-2/3">
            <Input
              func={setPName}
              value={pName}
              label="Project Name"
              placeholder="project name"
              type="text"
              theme={theme}
              css="w-full"
            />
            <Input
              func={setDisplayName}
              value={displayName}
              label="Display name"
              placeholder="display name"
              type="text"
              theme={theme}
              css="w-full"
            />
            <TextBox
              func={setDesc}
              label="Description"
              value={desc}
              theme={theme}
            />
            <CalRange />
          </div>
        </div>
        <div className="flex flex-col w-1/2 items-center">
          <div className="flex flex-row w-full">
            <div
              className={`flex flex-col w-56 border-r border-l mx-3 items-center ${theme.border}`}
            >
              <p className="text-xl">Members</p>
              <div className="flex flex-col w-full">{mapMembers}</div>
            </div>
            <div
              className={`flex flex-col w-56 border-r border-l mx-3 items-center ${theme.border}`}
            >
              <p>Admins</p>
              <div className="flex flex-col w-full">{mapAdmins}</div>
            </div>
          </div>
        </div>
      </div>
      <button
        className={`flex ${theme.buttonColor} w-96 py-2 px-10 rounded-lg my-1 justify-center mt-10`}
        onClick={() => saveChanges()}
      >
        Save changes
      </button>
    </div>
  );
}

const Member = ({
  user,
  theme,
  members,
  setProjectMembers,
  admins,
  setProjectAdmins,
}: {
  user: SingleUser;
  theme: ThemeInterface;
  members: SingleUser[];
  setProjectMembers: React.Dispatch<React.SetStateAction<SingleUser[]>>;
  admins: SingleUser[];
  setProjectAdmins: React.Dispatch<React.SetStateAction<SingleUser[]>>;
}) => {
  const [dropdown, setDropdown] = useState(false);

  return (
    <div className="w-full">
      <div
        className={`flex flex-row items-center my-1 rounded-lg px-1 hover:${theme.background.darker} cursor-pointer`}
        onClick={() => setDropdown(!dropdown)}
        key={user.id}
      >
        <img
          className={`object-cover w-10 h-10 rounded-full border-2 ${theme.profile}`}
          src={URL.createObjectURL(
            new Blob([new Uint8Array(user.avatar.data)])
          )}
          alt="avatar"
        />
        <div className="flex w-full justify-between">
          <p className="flex mx-1">{user.name}</p>
          {dropdown ? (
            <DownArrow css={"mr-2 rounded-full"} />
          ) : (
            <UpArrow css={"mr-2 rounded-full"} />
          )}
        </div>
      </div>
      {dropdown && (
        <DropDown
          user={user}
          theme={theme}
          members={members}
          setProjectMembers={setProjectMembers}
          admins={admins}
          setProjectAdmins={setProjectAdmins}
        />
      )}
    </div>
  );
};

const Admin = ({
  user,
  theme,
  members,
  setProjectMembers,
  admins,
  setProjectAdmins,
}: {
  user: SingleUser;
  theme: ThemeInterface;
  members: SingleUser[];
  setProjectMembers: React.Dispatch<React.SetStateAction<SingleUser[]>>;
  admins: SingleUser[];
  setProjectAdmins: React.Dispatch<React.SetStateAction<SingleUser[]>>;
}) => {
  const [dropdown, setDropdown] = useState(false);

  return (
    <div className="w-full">
      <div
        className={`flex flex-row items-center my-1 rounded-lg px-1 hover:${theme.background.darker} cursor-pointer`}
        onClick={() => setDropdown(!dropdown)}
        key={user.id}
      >
        <img
          className={`object-cover w-10 h-10 rounded-full border-2 ${theme.profile}`}
          src={URL.createObjectURL(
            new Blob([new Uint8Array(user.avatar.data)])
          )}
          alt="avatar"
        />
        <div className="flex w-full justify-between">
          <p className="flex mx-1">{user.name}</p>
          {dropdown ? (
            <DownArrow css={"mr-2 rounded-full"} />
          ) : (
            <UpArrow css={"mr-2 rounded-full"} />
          )}
        </div>
      </div>
      {dropdown && (
        <DropDownAdmin
          user={user}
          theme={theme}
          members={members}
          setProjectMembers={setProjectMembers}
          admins={admins}
          setProjectAdmins={setProjectAdmins}
        />
      )}
    </div>
  );
};

const DropDownAdmin = ({
  user,
  theme,
  members,
  setProjectMembers,
  admins,
  setProjectAdmins,
}: {
  user: SingleUser;
  theme: ThemeInterface;
  members: SingleUser[];
  setProjectMembers: React.Dispatch<React.SetStateAction<SingleUser[]>>;
  admins: SingleUser[];
  setProjectAdmins: React.Dispatch<React.SetStateAction<SingleUser[]>>;
}) => {
  const demoteAdmin = () => {
    setProjectAdmins(admins.filter((admin) => admin.id !== user.id));
    setProjectMembers((members) => [...members, user]);
  };
  return (
    <div className={`fixed ${theme.background.main}`}>
      <div
        className={`w-60 border ${theme.border} rounded-lg text-sm py-3 px-2 ${theme.text.secondary} shadow-lg`}
      >
        <div className={`flex flex-col py-1 px-2 rounded`}>
          <div
            className={`flex hover:${theme.background.light} py-1 px-2 rounded my-1 cursor-pointer items-center`}
            onClick={() => demoteAdmin()}
          >
            <div className={`${theme.text.main} text-md mr-2`}>Demote</div>
            <div className="text-s italic">
              @{user.username} from the Project
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DropDown = ({
  user,
  theme,
  members,
  setProjectMembers,
  admins,
  setProjectAdmins,
}: {
  user: SingleUser;
  theme: ThemeInterface;
  members: SingleUser[];
  setProjectMembers: React.Dispatch<React.SetStateAction<SingleUser[]>>;
  admins: SingleUser[];
  setProjectAdmins: React.Dispatch<React.SetStateAction<SingleUser[]>>;
}) => {
  const promoteToAdmin = async () => {
    if (!admins.includes(user)) {
      setProjectMembers(members.filter((member) => member.id !== user.id));
      setProjectAdmins((admins: any) => [...admins, user]);
    }
  };

  const removeFromProject = () => {
    if (members.includes(user)) {
      setProjectMembers(members.filter((member) => member.id !== user.id));
      setProjectAdmins(admins.filter((admin) => admin.id !== user.id));
    }
  };

  console.log(admins);

  return (
    <div className={`fixed ${theme.background.main}`}>
      <div
        className={`w-60 border ${theme.border} rounded-lg text-sm py-3 px-2 ${theme.text.secondary} shadow-lg`}
      >
        <div className={`flex flex-col py-1 px-2 rounded`}>
          <div
            className={`flex hover:${theme.background.light} py-1 px-2 rounded my-1 cursor-pointer items-center`}
            onClick={() => promoteToAdmin()}
          >
            <div className={`${theme.text.main} text-md mr-2`}>Promote</div>
            <div className="text-s italic">@{user.username} to Admin</div>
          </div>
          <div
            className={`flex hover:${theme.background.light} py-1 px-2 rounded my-1 cursor-pointer items-center`}
            onClick={() => removeFromProject()}
          >
            <div className={`${theme.text.main} text-md mr-2`}>Remove</div>
            <div className="text-s italic">
              @{user.username} from the Project
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DateCheck = (d: any) => {
  if (Object.prototype.toString.call(d) === "[object Date]") {
    if (isNaN(d.getTime())) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
};
