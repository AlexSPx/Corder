import React from "react";
import { useHistory } from "react-router-dom";
import {
  TeamInterface,
  ThemeInterface,
  userDataInterface,
} from "../../Interfaces";
import { CogIcon } from "../../public/SmallSvgs";
import { Button } from "../Public/Button";

export default function TeamCard({
  team,
  theme,
  user,
}: {
  team: TeamInterface;
  theme: ThemeInterface;
  user: userDataInterface;
}) {
  return (
    <div className={`flex h-32 border ${theme.border} rounded-3xl my-2`}>
      <div
        className={`flex justify-center overflow-hidden w-1/4 ${theme.background.darker} rounded-l-3xl`}
      >
        <img
          className="object-cover w-full z-10"
          src={URL.createObjectURL(
            new Blob([new Uint8Array(team.image!.data)])
          )}
          alt="logo"
        />
      </div>
      <div className="flex flex-col mx-3 my-2 w-1/4 truncate">
        <div className="flex flex-row items-center">
          <p className={`text-xl ${theme.text.main}`}>{team.displayname}</p>
          <p className={`text-lg ${theme.text.secondary}`}> #{team.name}</p>
        </div>
        <div className="flex flex-col py-1 w-24">
          <Button
            label="Projects"
            to={`${team.name}/projects`}
            css={
              "border-l-2 w-full px-1 mb-1 " +
              theme.profile +
              " transition duration-200 hover:bg-indigo-200"
            }
          />
          <Button
            label="Members"
            to={`${team.name}/members`}
            css={
              "border-l-2 w-full px-1 mb-1 " +
              theme.profile +
              " transition duration-200 hover:bg-indigo-200"
            }
          />
          <Button
            label="Chat rooms"
            to={`${team.name}/chats`}
            css={
              "border-l-2 w-full px-1 mb-1 " +
              theme.profile +
              " transition duration-200 hover:bg-indigo-200"
            }
          />
        </div>
      </div>
      <div
        className={`flex flex-col w-1/3 border-l-2 border-r-2 items-center ml-4 px-4`}
      >
        <p>Description</p>
        <p className="overflow-ellipsis overflow-hidden">
          {team.description.desc}
        </p>
      </div>
      {team.admins.includes(user.id) ? <Settings /> : ""}
    </div>
  );
}

const Settings = () => {
  return (
    <div className="flex flex-grow items-center justify-center">
      <CogIcon css="cursor-pointer" />
    </div>
  );
};
