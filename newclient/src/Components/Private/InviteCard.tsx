import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  InviteInterface,
  TeamInterface,
  ThemeInterface,
} from "../../Interfaces";
import { baseurl } from "../../routes";

export default function InviteCard({
  invite,
  theme,
}: {
  invite: InviteInterface;
  theme: ThemeInterface;
}) {
  const [team, setTeam] = useState<TeamInterface>();

  useEffect(() => {
    const fetchTeam = async () => {
      const team = await axios.post<TeamInterface[]>(
        `${baseurl}/teams/fetchteam`,
        {
          teamid: invite.teamID,
        },
        { withCredentials: true }
      );
      setTeam(team.data[0]);
    };

    fetchTeam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAccept = async () => {
    const reqbody = {
      invid: invite.id,
      teamid: invite.teamID,
      userid: invite.userID,
      status: true,
    };

    const res = await axios.post(`${baseurl}/teams/invres`, reqbody, {
      withCredentials: true,
    });

    console.log(res);
    window.location.reload();
  };

  const handleDecline = async () => {
    const reqbody = {
      invid: invite.id,
      teamid: invite.teamID,
      userid: invite.userID,
      status: true,
    };

    const res = await axios.post(`${baseurl}/teams/invres`, reqbody, {
      withCredentials: true,
    });

    console.log(res);
    window.location.reload();
  };

  return (
    <div className={`flex h-32 border ${theme.border} rounded-3xl my-2`}>
      <div
        className={`flex justify-center overflow-hidden w-1/4 ${theme.background.darker} rounded-l-3xl`}
      >
        {team ? (
          <img
            className="object-cover w-full z-10"
            src={URL.createObjectURL(
              new Blob([new Uint8Array(team.image!.data)])
            )}
            alt="logo"
          />
        ) : (
          ""
        )}
      </div>
      <div className="flex flex-col mx-3 my-2 w-1/4 truncate">
        <div className="flex flex-row items-center">
          <p className={`text-xl ${theme.text.main}`}>{team?.displayname}</p>
          <p className={`text-lg ${theme.text.secondary}`}> #{team?.name}</p>
        </div>
        <div className="flex flex-col py-1 w-24">
          <ActionButton
            css={
              "border-l-2 w-full px-1 mb-1 " +
              theme.profile +
              " transition duration-200 hover:bg-indigo-200"
            }
            label="Accept"
            action={() => handleAccept()}
          />
          <ActionButton
            css={
              "border-l-2 w-full px-1 mb-1 border-red-300 transition duration-200 hover:bg-red-300"
            }
            label="Decline"
            action={() => handleDecline()}
          />
        </div>
      </div>
      <div
        className={`flex flex-col w-1/3 border-l-2 border-r-2 items-center ml-4 px-4`}
      >
        <p>Description</p>
        <p className="overflow-ellipsis overflow-hidden">
          {team?.description.desc}
        </p>
      </div>
    </div>
  );
}

const ActionButton = ({
  css,
  label,
  action,
}: {
  css: string;
  label: string;
  action: any;
}) => {
  return (
    <div className={`cursor-pointer ${css}`} onClick={action}>
      {label}
    </div>
  );
};
