import axios from "axios";
import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { Light } from "../../ColorTheme";
import { ThemeContext } from "../../Context/ThemeContext";
import { b64toBlob } from "../../functions";
import { ThemeInterface } from "../../Interfaces";
import { teamdef } from "../../public/teamdef";
import { baseurl } from "../../routes";

export default function CreateTeam() {
  const themeCtx = useContext(ThemeContext);

  const theme =
    themeCtx?.themeData.data === undefined ? Light : themeCtx.themeData.data;

  const history = useHistory();

  const [name, setName] = useState<string>();
  const [displayname, setDisplayname] = useState<string>();
  const [company, setCompany] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [mmbArr, setmmbArr] = useState([]);
  const [photo, setPhoto] = useState(b64toBlob(teamdef));

  const handleMembers = (e: any) => {
    setmmbArr(e.split(/, | |;|,/).filter((word: string) => word.trim()));
  };

  const mapInvites = mmbArr.map((invite) => {
    return (
      <div
        className={`flex ${theme.background.main} border ${theme.profile} rounded-full h-8 items-center justify-center mx-1 p-3 hover:${theme.background.darker} cursor-pointer`}
        onClick={() => {
          setmmbArr(mmbArr.filter((mmbr) => mmbr !== invite));
        }}
      >
        {invite}
      </div>
    );
  });

  const handleSubmit = async () => {
    if (name && description && mmbArr && displayname) {
      const desc = { company, desc: description };

      const image = new FormData();
      image.append("image", photo);

      const newTeam = {
        name,
        displayname,
        description: desc,
        members: mmbArr,
      };

      const results = await axios.post(`${baseurl}/teams/create`, newTeam, {
        withCredentials: true,
      });

      setTimeout(
        await axios.post(`${baseurl}/teams/changeimg/${results.data}`, image, {
          withCredentials: true,
        }),
        3000
      );

      if (results.data) {
        history.push("/teams");
      }
    }
  };

  return (
    <div
      className={`flex flex-col h-full items-center ${theme.background.body}`}
    >
      <p className={`text-3xl font-thin ${theme.text.main} mt-20 mb-4`}>
        Create a new team
      </p>
      <div className="flex flex-row w-4/6 mt-4 h-full">
        <div className="flex flex-col w-3/5">
          <div className="flex w-full">
            <Input
              func={setName}
              label="Team name"
              placeholder="team name"
              type="text"
              theme={theme}
              css="w-1/2 mr-1"
            />
            <Input
              func={setDisplayname}
              label="Display Name"
              placeholder="display name"
              type="text"
              theme={theme}
              css="w-1/2"
            />
          </div>
          <Input
            func={handleMembers}
            label="Invites"
            placeholder="(email) e.g. alex@mail.com, bobby@mail.com, dubov@mail.com"
            type="text"
            theme={theme}
            css="w-full"
          />
          <Input
            func={setCompany}
            label="Company Name"
            placeholder="Enter company name"
            type="text"
            theme={theme}
            css="w-full"
          />
          <TextBox
            func={setDescription}
            label="Set Description"
            theme={theme}
            css=""
          />
          <div className="flex">{mapInvites}</div>
        </div>
        <div className="flex flex-col items-center w-2/6">
          <div className="flex w-36 h-36 rounded-full my-3">
            <img
              className="flex w-36 h-36 rounded-full object-cover"
              src={URL.createObjectURL(photo)}
              alt="logo"
            />
          </div>
          <label
            className={`flex border ${theme.border} hover:${theme.profile} py-2 px-10 rounded-lg my-1 justify-center text-xl font-thin cursor-pointer`}
          >
            Change team photo
            <input
              type="file"
              className="hidden"
              onChange={(e: React.ChangeEvent<any>): void =>
                setPhoto(e.target.files[0])
              }
            />
          </label>
          <div
            className={`flex ${theme.buttonColor} py-2 px-12 rounded-lg my-1 justify-center text-xl font-thin cursor-pointer mt-3`}
            onClick={() => handleSubmit()}
          >
            Create a new team
          </div>
        </div>
      </div>
    </div>
  );
}

const Input = ({
  func,
  label,
  placeholder,
  type,
  theme,
  css,
}: {
  func: any;
  label: string;
  placeholder: string;
  type: "password" | "text";
  theme: ThemeInterface;
  css: string;
}) => {
  return (
    <div className={`${css} my-1`}>
      <label className="block text-grey-darker text-sm mb-1">{label}</label>
      <input
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker ${theme.background.main} ${theme.border}`}
        type={type}
        placeholder={placeholder}
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
          func(e.target.value)
        }
      />
    </div>
  );
};

const TextBox = ({
  func,
  label,
  theme,
  css,
}: {
  func: any;
  label: string;
  theme: ThemeInterface;
  css: string;
}) => {
  return (
    <div className={`${css} my-1`}>
      <label className="block text-grey-darker text-sm mb-1">{label}</label>
      <textarea
        placeholder="Team description"
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker ${theme.background.main} ${theme.border}`}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void =>
          func(e.target.value)
        }
      />
    </div>
  );
};
