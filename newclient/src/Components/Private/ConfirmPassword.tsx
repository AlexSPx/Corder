import axios from "axios";
import React, { useState } from "react";
import { ThemeInterface } from "../../Interfaces";
import { CheckIcon, CrossIcon } from "../../public/SmallSvgs";
import { baseurl } from "../../routes";
import { LoadingFlexCenter } from "../Public/Loading";

export default function ConfirmPassword({
  theme,
  setAuthMenu,
  setAuth,
}: {
  theme: ThemeInterface;
  setAuthMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setAuth: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [password, setPassword] = useState<string>();
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState();
  const [cerror, setCerror] = useState(false);

  const handleAuth = async () => {
    if (password && password === confirmPassword) {
      setCerror(false);
      setLoading(true);
      setSuccess(undefined);

      const auth = await axios.post(
        `${baseurl}/authuser/cpassword`,
        { password },
        { withCredentials: true }
      );

      setLoading(false);
      setSuccess(auth.data);
      setTimeout(() => {
        setAuthMenu(false);
        setAuth(auth.data);
      }, 1000);
    } else {
      setCerror(true);
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen ${theme.background.light} text-opacity-100 bg-opacity-30 font-thin`}
    >
      <div className="flex h-full items-center justify-center">
        <div
          className={`flex flex-col rounded-md py-3 px-3 w-4/6 sm:w-96 ${theme.background.main} shadow-md`}
        >
          <p className="text-center w-full text-xl my-1">Authenticate</p>
          <p className={`text-lg`}>Password</p>
          <input
            className={` border-b focus:outline-none text-xl `}
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setPassword(e.target.value)
            }
          />
          <p className={`text-lg`}>Confirm Password</p>
          <input
            className={` border-b focus:outline-none text-xl `}
            type="password"
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setConfirmPassword(e.target.value)
            }
          />
          <button
            className={`my-2 py-2 rounded-lg border ${theme.buttonColor}`}
            onClick={() => handleAuth()}
          >
            Confirm
          </button>
          <button
            className={`my-2 py-2 rounded-lg border ${theme.profile} hover:${theme.background.light}`}
            onClick={() => setAuthMenu(false)}
          >
            Cancel
          </button>
          {loading && <LoadingFlexCenter css="h-10 w-10 mt-2" />}
          <div className="flex w-full justify-center">
            {cerror && (
              <p className="text-lg text-red-500">Passwords not matching</p>
            )}
            {success !== undefined &&
              !loading &&
              (success ? (
                <CheckIcon css="w-12 h-12" color="#34d399" />
              ) : (
                <CrossIcon css="w-12 h-12" color="#ef4444" />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
