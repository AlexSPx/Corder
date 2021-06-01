import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Light } from "../../ColorTheme";
import ConfirmPassword from "../../Components/Private/ConfirmPassword";
import { LoadingFlexCenter } from "../../Components/Public/Loading";
import { ThemeContext } from "../../Context/ThemeContext";
import { UserContext } from "../../Context/UserContext";
import { ThemeInterface, userContextInterface } from "../../Interfaces";
import {
  CheckIcon,
  CircleCheck,
  CrossIcon,
  EmailIcon,
  ImageIcon,
} from "../../public/SmallSvgs";
import { baseurl } from "../../routes";

export default function Profile() {
  const userCtx = useContext(UserContext);
  const themeCtx = useContext(ThemeContext);

  const theme =
    themeCtx?.themeData.data === undefined ? Light : themeCtx.themeData.data;

  return (
    <div
      className={`flex flex-col h-full w-full overflow-auto ${theme.background.body} font-thin items-center`}
    >
      <div className="flex flex-col w-full md:2/3 xl:w-1/3">
        <LineBreak label="Public Settings" />
        <PublicSettings theme={theme} userCtx={userCtx!} />
        <LineBreak label="Change Email" />
        <EmailChange theme={theme} userCtx={userCtx!} />
        <LineBreak label="Change Password" />
        <PasswordChange theme={theme} userCtx={userCtx!} />
      </div>
    </div>
  );
}

const PublicSettings = ({
  theme,
  userCtx,
}: {
  theme: ThemeInterface;
  userCtx: userContextInterface;
}) => {
  const [avatar, setAvatar] = useState(userCtx?.userData.avatar);
  const [username, setUsername] = useState(userCtx?.userData.username);
  const [name, setName] = useState(userCtx?.userData.name);
  const [authMenu, setAuthMenu] = useState(false);

  const [authCheckP, setAuthCheckP] = useState(false);

  const activateAuthMenu = () => {
    if (
      avatar !== userCtx?.userData.avatar ||
      username !== userCtx?.userData.username ||
      name !== userCtx?.userData.name
    ) {
      setAuthMenu(true);
    } else {
      console.log("no changes");
    }
  };

  useEffect(() => {
    const saveChanges = async () => {
      if (
        username !== userCtx?.userData.username ||
        name !== userCtx?.userData.name
      ) {
        await axios.post(
          `${baseurl}/authuser/changes`,
          {
            newName: name,
            newUsername: username,
          },
          { withCredentials: true }
        );
      }

      if (avatar !== userCtx?.userData.avatar) {
        const avatarSet = new FormData();
        avatarSet.append("avatar", avatar);
        await axios.post(`${baseurl}/authuser/changepfp`, avatarSet, {
          withCredentials: true,
        });
      }

      window.location.reload();

      setAuthCheckP(false);
    };

    if (authCheckP) {
      saveChanges();
    }
  }, [authCheckP]);

  return (
    <div className="flex flex-row w-full justify-center items-center ">
      <label className="cursor-pointer relative rounded-full border-2 overflow-hidden">
        <div
          className={`absolute inset-0 ${theme.background.body} opacity-0 hover:opacity-40`}
        >
          <div className="flex flex-col w-full h-full items-center justify-center">
            <ImageIcon css="w-12 h-12" />
            <p className="hidden md:flex">Change Avatar</p>
          </div>
        </div>
        <img
          className={`object-cover w-24 h-24 md:w-48 md:h-48 ${theme.profile}`}
          src={URL.createObjectURL(avatar)}
          alt="avatar"
        />
        <input
          type="file"
          className="hidden"
          onChange={(e: React.ChangeEvent<any>): void =>
            setAvatar(e.target.files[0])
          }
        />
      </label>
      <div className="flex flex-col ml-3">
        <p className={`text-xl`}>Username</p>
        <input
          className={`${theme.background.body} border-b-2 focus:outline-none text-lg`}
          type="text"
          value={username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
            setUsername(e.target.value)
          }
        />
        <p className={`text-xl mt-3`}>Name</p>
        <input
          className={`${theme.background.body} border-b-2 focus:outline-none text-lg`}
          type="text"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
            setName(e.target.value)
          }
        />
        <button
          className={`mt-2 py-1 rounded-lg border ${theme.buttonColor}`}
          onClick={() => activateAuthMenu()}
        >
          Save changes
        </button>

        {authMenu && (
          <ConfirmPassword
            theme={theme}
            setAuthMenu={setAuthMenu}
            setAuth={setAuthCheckP}
          />
        )}
      </div>
    </div>
  );
};

const EmailChange = ({
  theme,
  userCtx,
}: {
  theme: ThemeInterface;
  userCtx: userContextInterface;
}) => {
  const [email, setEmail] = useState(userCtx?.userData.email);
  const [code, setCode] = useState<string>();

  const [authMenu, setAuthMenu] = useState(false);
  const [status, setStatus] = useState();

  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useState(false);

  const verifyCode = async () => {
    if (code) {
      const res = await axios.get(
        `${baseurl}/authuser/changes/email/${code}/confirm`,
        { withCredentials: true }
      );

      setLoading(false);
      setStatus(res.data);
      if (res.data) {
        setTimeout(() => window.location.reload(), 2000);
      }
    }
  };

  useEffect(() => {
    const sendCode = async () => {
      setStatus(undefined);
      setAuth(false);

      const res = await axios.get(
        `${baseurl}/authuser/changes/email/${email}`,
        { withCredentials: true }
      );

      if (res.data) {
        setLoading(true);
      }
    };
    if (auth) {
      sendCode();
    }
  }, [auth]);

  return (
    <div className="flex flex-row justify-center items-center">
      <div className="flex flex-col mx-3">
        <p className={`italic ${theme.text.secondary}`}>
          Current Email: {userCtx?.userData.email}
        </p>
        <div className="flex flex-row items-center border-b-2">
          <EmailIcon css="mt-1" />
          <input
            className={`${theme.background.body} focus:outline-none text-lg px-4`}
            type="text"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setEmail(e.target.value)
            }
          />
        </div>
        <button
          className={`mt-2 py-1 rounded-lg border ${theme.buttonColor}`}
          onClick={() => setAuthMenu(true)}
        >
          Send Code
        </button>
        {authMenu && (
          <ConfirmPassword
            theme={theme}
            setAuthMenu={setAuthMenu}
            setAuth={setAuth}
          />
        )}
        <div className="flex flex-col mt-3">
          <p className={`text-xl `}>Activation Code</p>
          <div className="flex">
            <input
              className={`${theme.background.body} focus:outline-none text-lg border-b-2 w-full`}
              type="text"
              value={code}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setCode(e.target.value)
              }
            />
          </div>
          <button
            className={`mt-2 py-1 rounded-lg border ${theme.buttonColor}`}
            onClick={() => verifyCode()}
          >
            Confirm
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center ml-12">
        <p className={`${theme.text.main} text-xl text-center my-1`}>Status</p>
        <div className="flex w-36 h-36 rounded-full border">
          {loading && <LoadingFlexCenter css="w-36 h-36" />}

          {status !== undefined &&
            (status ? (
              <CircleCheck css="w-36 h-36" color="#34d399" />
            ) : (
              <CrossIcon css="w-36 h-36" color="#ef4444" />
            ))}
        </div>
      </div>
    </div>
  );
};

const PasswordChange = ({
  theme,
  userCtx,
}: {
  theme: ThemeInterface;
  userCtx: userContextInterface;
}) => {
  const [newPassword, setNewPassword] = useState<string>();
  const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>();

  const [status, setStatus] = useState();
  const [loading, setLoading] = useState(false);

  const [authMenu, setAuthMenu] = useState(false);
  const [auth, setAuth] = useState(false);
  const [code, setCode] = useState<string>();

  const [clientError, setClientError] = useState<string>();

  const verifyCode = async () => {
    if (code) {
      const res = await axios.get(
        `${baseurl}/authuser/changes/password/${code}/confirm`,
        { withCredentials: true }
      );

      setLoading(false);
      setStatus(res.data);
      if (res.data) {
        setTimeout(() => window.location.reload(), 2000);
      }
    }
  };

  useEffect(() => {
    const sendCode = async () => {
      console.log("huh");

      if (newPassword === newPasswordConfirm) {
        setStatus(undefined);
        setAuth(false);

        const res = await axios.get(
          `${baseurl}/authuser/changes/password/${newPassword}`,
          { withCredentials: true }
        );

        if (res.data) {
          setLoading(true);
        }
      } else {
        console.log("passwords not matching");
      }
    };
    if (auth) {
      sendCode();
    }
  }, [auth]);

  return (
    <div className="flex flex-row justify-center items-center">
      <div className="flex flex-col mx-3">
        <p className={`italic ${theme.text.secondary}`}>
          Current Email: {userCtx?.userData.email}
        </p>
        <div className="flex flex-col mt-3">
          <p className={`text-xl `}>New password</p>
          <div className="flex">
            <input
              className={`${theme.background.body} focus:outline-none text-lg border-b-2 w-full`}
              type="password"
              value={newPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setNewPassword(e.target.value)
              }
            />
          </div>
          <p className={`text-xl `}>Confirm new password</p>
          <div className="flex">
            <input
              className={`${theme.background.body} focus:outline-none text-xl border-b-2 w-full`}
              type="password"
              value={newPasswordConfirm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setNewPasswordConfirm(e.target.value)
              }
            />
          </div>
          <p className={`${theme.text.secondary} italic`}>{clientError}</p>
          <button
            className={`mt-2 py-1 rounded-lg border ${theme.buttonColor}`}
            onClick={() => setAuthMenu(true)}
          >
            Send Code
          </button>
        </div>
        <div className="flex flex-col mt-3">
          <p className={`text-xl `}>Activation Code</p>
          <div className="flex">
            <input
              className={`${theme.background.body} focus:outline-none text-lg border-b-2 w-full`}
              type="text"
              value={code}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setCode(e.target.value)
              }
            />
          </div>
          <button
            className={`mt-2 py-1 rounded-lg border ${theme.buttonColor}`}
            onClick={() => verifyCode()}
          >
            Confirm
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center ml-12">
        <p className={`${theme.text.main} text-xl text-center my-1`}>Status</p>
        <div className="flex w-36 h-36 rounded-full border ">
          {loading && <LoadingFlexCenter css="w-36 h-36" />}

          {status !== undefined &&
            (status ? (
              <CircleCheck css="w-36 h-36" color="#34d399" />
            ) : (
              <CrossIcon css="w-36 h-36" color="#ef4444" />
            ))}
        </div>
      </div>

      {authMenu && (
        <ConfirmPassword
          theme={theme}
          setAuthMenu={setAuthMenu}
          setAuth={setAuth}
        />
      )}
    </div>
  );
};

const LineBreak = ({ label }: { label: string }) => {
  return (
    <div className="flex items-center justify-center my-5 mt-12">
      <div className="flex border-b-2 flex-1"></div>
      <p className="mx-2 text-xl">{label}</p>
      <div className="flex border-b-2 flex-1"></div>
    </div>
  );
};
