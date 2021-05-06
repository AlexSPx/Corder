import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";
import React, { useState } from "react";
import { ProjectInterface, ThemeInterface } from "../../Interfaces";
import ToggleButton from "./ToggleButton";
import UserSelector from "./UserSelector";

export const AssignmentForm = ({
  theme,
  project,
  members,
  dates,
  setMembers,
  setName,
  setDesc,
  setDates,
}: {
  theme: ThemeInterface;
  project: ProjectInterface;
  members: string[];
  dates: Date | [(Date | undefined)?, (Date | undefined)?] | null | undefined;
  setMembers: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  setName: React.Dispatch<React.SetStateAction<string | undefined>>;
  setDesc: React.Dispatch<React.SetStateAction<string | undefined>>;
  setDates: React.Dispatch<
    React.SetStateAction<
      Date | [(Date | undefined)?, (Date | undefined)?] | null | undefined
    >
  >;
}) => {
  const [toggleMembers, setToggleMembers] = useState(false);

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

  return (
    <div className="flex flex-col">
      <div className="flex flex-col w-full mt-1">
        <label className="text-lg ml-1">Assignment Name</label>
        <input
          type="text"
          placeholder="assignment name"
          className={`appearance-none border w-full py-2 px-3 text-grey-darker ${theme.background.main} ${theme.border}`}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
            setName(e.target.value)
          }
        />
      </div>
      <div className="flex flex-col w-full mt-1">
        <label className="text-lg ml-1">Description</label>
        <textarea
          placeholder="assignment description"
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
              ids={project.members[0] as any}
              selected={members}
              setSelected={setMembers as any}
            />
          </div>
        )}
      </div>
      <CalRange />
    </div>
  );
};
