import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { UserContext } from "../../../Context/UserContext";
import { TeamInterface, ThemeInterface } from "../../../Interfaces";
import { DownArrow, UpArrow } from "../../../public/SmallSvgs";
import { baseurl } from "../../../routes";
import { LoadingFlexCenter } from "../../Public/Loading";

export default function HeaderDropdown({ theme }: { theme: ThemeInterface }) {
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState<TeamInterface[]>();

  const userCtx = useContext(UserContext);

  useEffect(() => {
    const fetchTeams = async () => {
      const res = await axios.get<TeamInterface[]>(`${baseurl}/teams/myteams`, {
        withCredentials: true,
      });
      setTeams(res.data);
      setLoading(false);
    };

    fetchTeams();
  }, []);

  const mapTeams = teams?.map((team) => {
    return <TeamChatCard team={team} theme={theme} key={team.id} />;
  });

  return (
    <div
      className={`origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg ${theme.background.darker} ring-1 ring-black ring-opacity-5 focus:outline-none`}
      role="menu"
      tabIndex={-1}
    >
      {loading ? (
        <div className="flex my-3">
          <LoadingFlexCenter css={"h-12 w-12 border-2 border-t-2"} />
        </div>
      ) : (
        <div className="flex flex-col">{mapTeams}</div>
      )}
    </div>
  );
}

const TeamChatCard = ({
  team,
  theme,
}: {
  team: TeamInterface;
  theme: ThemeInterface;
}) => {
  const history = useHistory();
  const toroom = () => {
    history.push(`/${team.name}/chats`);
  };

  const { name } = useParams() as any;

  const selected = team.name === name ? theme.background.light : null;

  return (
    <div className="flex w-full h-12 items-center my-1 px-3">
      <div className="inline-block relative w-full h-full">
        <div
          className={`flex flex-row w-full h-full items-center rounded-lg hover:${theme.background.light} ${selected} cursor-pointer`}
          onClick={() => toroom()}
        >
          <img
            src={URL.createObjectURL(
              new Blob([new Uint8Array(team.image!.data)])
            )}
            alt={team.name}
            className={`flex h-10 w-10 rounded-full border ml-2 ${theme.profile}`}
          />
          <div className="flex flex-col ml-2">
            <p className="text-lg leading-none">{team.displayname}</p>
            <p className="text-sm italic leading-none">Chat rooms</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TeamHeader = ({
  team,
  theme,
}: {
  team: TeamInterface;
  theme: ThemeInterface;
}) => {
  const [dropdown, setDropdown] = useState(false);

  return (
    <div className="flex w-full items-center my-1 px-3 sticky h-12 top-0">
      <div className="inline-block relative w-full h-full">
        <div
          className={`flex flex-row w-full h-full items-center justify-between rounded-lg ${theme.background.darker}`}
        >
          <div className="flex">
            <img
              src={URL.createObjectURL(
                new Blob([new Uint8Array(team.image!.data)])
              )}
              alt={team.name}
              className={`flex h-10 w-10 rounded-full border cursor-pointer ml-2 ${theme.profile}`}
            />
            <div className="flex flex-col ml-2">
              <p className="text-lg leading-none">{team.displayname}</p>
              <p className="text-sm italic leading-none">Chat rooms</p>
            </div>
          </div>
          <div
            className="inline-block relative"
            onClick={() => setDropdown(!dropdown)}
          >
            {dropdown ? (
              <DownArrow
                css={
                  "mr-2 rounded-full cursor-pointer hover:" +
                  theme.background.light
                }
              />
            ) : (
              <UpArrow
                css={
                  "mr-2 rounded-full cursor-pointer hover:" +
                  theme.background.light
                }
              />
            )}
          </div>
        </div>
        {dropdown && <HeaderDropdown theme={theme} />}
      </div>
    </div>
  );
};
