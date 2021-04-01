import axios from "axios";
import React, { useContext, useState } from "react";
import { Light } from "../../ColorTheme";
import { ThemeContext } from "../../Context/ThemeContext";
import { UserContext } from "../../Context/UserContext";
import { baseurl } from "../../routes";

export default function Activation() {
  const themeCtx = useContext(ThemeContext);
  const userCtx = useContext(UserContext);

  const theme =
    themeCtx?.themeData.data === undefined ? Light : themeCtx.themeData.data;

  const [code, setCode] = useState("");
  const [errorM, setErrorM] = useState("");
  const [message, setMessage] = useState("");
  const handleActivation = async () => {
    if (code) {
      const activation = {
        userid: userCtx?.userData.id,
        code,
      };

      const res = await axios.post(`${baseurl}/authuser/activate`, activation, {
        withCredentials: true,
      });

      if (res.data === true) {
        window.location.reload();
      } else {
        setErrorM("Wrong activation code");
      }
    } else {
      setErrorM("Wrong activation code");
    }
  };

  const resendCode = async () => {
    const data = {
      id: userCtx?.userData.id,
      email: userCtx?.userData.email,
    };

    const code = await axios.post(`${baseurl}/authuser/resendcode`, data, {
      withCredentials: true,
    });

    if (code.status === 200) {
      setMessage("Code has been resent");
    } else {
      setMessage("Something went wrong");
    }
  };

  return (
    <div
      className={`flex flex-col h-screen ${theme.background.main} ${theme.text.main} items-center justify-center`}
    >
      <img
        src={userCtx?.userData.avatar}
        className="flex bg-red-200 w-44 h-44 rounded-full object-cover"
        alt="avatar"
      />
      <p className={`text-xl my-3`}>
        Please enter the code sent to {userCtx?.userData.email}
      </p>

      <input
        className={`shadow appearance-none border rounded w-3/4 md:w-1/4 py-2 px-3 text-grey-darker ${theme.background.main} ${theme.border}`}
        id="code"
        type="text"
        placeholder="Enter the code here"
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
          setCode(e.target.value)
        }
      />
      <p className="my-1 text-xl">{errorM}</p>
      <p className="my-1 text-xl">{message}</p>
      <button
        className={`${theme.buttonColor} w-3/6 lg:w-1/6 rounded text-2xl font-thin py-1 my-3`}
        onClick={() => handleActivation()}
      >
        Acticate
      </button>
      <button
        className={`${theme.buttonColor} w-3/6 lg:w-1/6 rounded text-2xl font-thin py-1 my-3`}
        onClick={() => resendCode()}
      >
        Resend code
      </button>
    </div>
  );
}
