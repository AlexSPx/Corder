import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Light } from "../../../ColorTheme";
import useFetchMembers from "../../../Components/Private/Queries/useFetchMembersQuery";
import useTPAQuery from "../../../Components/Private/Queries/useTPAQuery";
import { ThemeContext } from "../../../Context/ThemeContext";
import { SingleUser, TeamInterface, ThemeInterface } from "../../../Interfaces";
import { baseurl } from "../../../routes";
import { Input, TextBox } from "../CreateTeam";

export default function TeamSettings() {
  const themeCtx = useContext(ThemeContext);

  const theme =
    themeCtx?.themeData.data === undefined ? Light : themeCtx.themeData.data;

  const { name: tname } = useParams() as any;

  const [team, setTeam] = useState<TeamInterface>();

  const [name, setName] = useState<string>();
  const [displayName, setDisplayName] = useState<string>(team?.displayname!);
  const [company, setCompany] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [changeImage, setChangeImage] = useState();

  const [removedMembers, setRemovedMembers] = useState<SingleUser[]>([]);
  const [removedAdmins, setRemovedAdmins] = useState<SingleUser[]>([]);
  const [promotedAdmins, setPromotedAdmins] = useState<SingleUser[]>([]);

  useTPAQuery({ option: "Team", amount: "One", team: tname, setData: setTeam });

  useEffect(() => {
    setDisplayName(team?.displayname!);
    setName(team?.name!);
    setCompany(team?.description.company);
    setDescription(team?.description.desc);
  }, [team]);

  const handleImageChange = async () => {
    if (changeImage) {
      const imageSet = new FormData();
      imageSet.append("image", changeImage!);

      await axios.post(`${baseurl}/teams/changeimg/${team?.id}`, imageSet, {
        withCredentials: true,
      });
      window.location.reload();
    }
  };

  const handleChanges = async () => {
    const nmembers = team?.members.filter(
      (el) => !removedMembers.includes(el as any)
    );

    let nadmins = team?.admins.filter(
      (el) => !removedAdmins.includes(el as any)
    );

    promotedAdmins.forEach((pad: any) => {
      if (!nadmins?.includes(pad)) {
        nadmins?.push(pad);
      }
    });

    const changes = {
      name: name,
      displayname: displayName,
      description: {
        desc: description,
        company: company,
      },
      members: nmembers!,
      admins: nadmins!,
    };

    console.log(changes);

    const res = await axios.post(
      `${baseurl}/teams/savechanges`,
      { id: team?.id, changes: changes },
      {
        withCredentials: true,
      }
    );

    if (res.data) {
      window.location.reload();
    }
  };

  return (
    <div
      className={`flex flex-col h-full w-full ${theme.background.body} ${theme.text.main} items-center font-thin`}
    >
      <div className="flex flex-col items-center mt-6">
        {team && (
          <img
            src={URL.createObjectURL(
              new Blob([new Uint8Array(team.image!.data)])
            )}
            alt="logo"
            className={`flex h-14 w-14 object-cover rounded-full border ${theme.profile}`}
          />
        )}
        <p className="text-2xl px-3">{team?.displayname} Settings</p>
      </div>
      <div className="flex flex-row w-2/3">
        <div className="flex flex-col w-1/2">
          <Input
            func={setName}
            label="Team name"
            placeholder="team name"
            type="text"
            theme={theme}
            value={name}
            css="w-full"
          />
          <Input
            func={setDisplayName}
            label="Team display name"
            placeholder="display name"
            type="text"
            theme={theme}
            value={displayName}
            css="w-full"
          />
          <Input
            func={setCompany}
            label="Company name"
            placeholder="display name"
            type="text"
            theme={theme}
            value={company}
            css="w-full"
          />
          <TextBox
            func={setDescription}
            label="Description"
            value={description}
            theme={theme}
          />
          <RemoveMembers
            theme={theme}
            selected={removedMembers}
            setSelected={setRemovedMembers}
            label="Remove members"
            ids={team?.members!}
          />
          <RemoveMembers
            theme={theme}
            selected={removedAdmins}
            setSelected={setRemovedAdmins}
            label="Remove admins"
            ids={team?.admins!}
          />
          <RemoveMembers
            theme={theme}
            selected={promotedAdmins}
            setSelected={setPromotedAdmins}
            label="Promote to admin"
            ids={team?.members!}
          />
          <div className="flex h-full w-full items-center justify-center">
            <div
              className={`flex w-full mt-3 justify-center py-2 px-4 border border-transparent text-md rounded-md ${theme.buttonColor} cursor-pointer`}
              onClick={() => handleChanges()}
            >
              Save Changes
            </div>
          </div>
        </div>
        <div className="flex flex-col h-full w-1/2 items-center justify-center">
          <div className="flex w-56 h-56 rounded-full bg-red-200">
            {team && (
              <img
                src={
                  changeImage
                    ? URL.createObjectURL(changeImage)
                    : team?.image
                    ? URL.createObjectURL(
                        new Blob([new Uint8Array(team?.image.data as any)])
                      )
                    : ""
                }
                alt="avatar"
                className="flex w-56 h-56 bg-red-200 rounded-full object-cover"
              />
            )}
          </div>
          <label
            className={`w-1/2 my-1 mt-6 flex justify-center py-2 px-4 border border-transparent text-md rounded-md ${theme.profile} hover:${theme.background.light} cursor-pointer`}
          >
            Change team photo
            <input
              type="file"
              accept=".png, .jpg, .jpeg"
              className="hidden"
              onChange={(e: React.ChangeEvent<any>): void =>
                setChangeImage(e.target.files[0])
              }
            />
          </label>
          <div
            className={`w-1/2 my-1 flex justify-center py-2 px-4 border border-transparent text-md rounded-md ${theme.buttonColor} cursor-pointer`}
            onClick={() => handleImageChange()}
          >
            Save Image
          </div>
        </div>
      </div>
    </div>
  );
}

const RemoveMembers = ({
  theme,
  label,
  selected,
  setSelected,
  ids,
}: {
  theme: ThemeInterface;
  label: string;
  selected: SingleUser[];
  setSelected: React.Dispatch<React.SetStateAction<SingleUser[]>>;
  ids: string[];
}) => {
  const { members } = useFetchMembers(ids);

  const mapAdmins = members?.map((mmbr) => {
    return (
      <div
        className={`flex rounded border ${
          theme.profile
        } px-3 mx-1 cursor-pointer ${
          selected.includes(mmbr.id as any) ? "bg-red-200" : ""
        }`}
        onClick={() => {
          const id: any = mmbr.id;
          if (!selected.includes(id)) {
            setSelected((selected): any => [...selected, mmbr.id]);
          } else {
            setSelected(selected.filter((tmmbr) => tmmbr.id));
          }
        }}
      >
        {mmbr.name}
      </div>
    );
  });

  return (
    <div className="flex flex-col my-1">
      <p className="mb-1">{label}</p>
      <div className="flex">{mapAdmins}</div>
    </div>
  );
};
