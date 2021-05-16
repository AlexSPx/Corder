import axios from "axios";
import React from "react";
import { FileInterface, ThemeInterface } from "../../Interfaces";
import { baseurl, docsurl } from "../../routes";

export default function FileCard({
  file,
  theme,
}: {
  file: FileInterface;
  theme: ThemeInterface;
}) {
  const handleOpenLink = () => {
    window.open(file.file, "_blank");
  };

  const handleOpenDocs = () => {
    window.open(`${docsurl}/docs/${file.id}`, "_blank");
  };

  const handleDownload = async () => {
    const res = await axios.post(
      `${baseurl}/files/word/download`,
      { path: file.file },
      {
        responseType: "blob",
        withCredentials: true,
      }
    );

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", file.name);
    document.body.appendChild(link);
    link.click();
  };

  switch (file.type) {
    case "document":
      return (
        <div
          className={`flex flex-col h-28 border-b ${theme.border} hover:${theme.background.darker} justify-center`}
        >
          <div className="flex flex-row mx-5 justify-between">
            <div className="flex flex-col justify-center">
              <p className={`text-2xl`}>Document</p>
              <p className={"text-lg"}>name: {file.name}</p>
            </div>
            <div className="flex flex-col justify-center">
              <p
                className={`text-xl cursor-pointer`}
                onClick={() => handleOpenDocs()}
              >
                Open Document
              </p>
            </div>
          </div>
        </div>
      );
    case "docx":
      return (
        <div
          className={`flex flex-col h-28 border-b ${theme.border} hover:${theme.background.darker} justify-center`}
        >
          <div className="flex flex-row mx-5 justify-between">
            <div className="flex flex-col justify-center">
              <p className={`text-2xl`}>Docs</p>
              <p className={"text-lg"}>name: {file.name}</p>
            </div>
            <div className="flex flex-col justify-center">
              <p
                className={`text-xl cursor-pointer`}
                onClick={() => handleDownload()}
              >
                Download Docs
              </p>
            </div>
          </div>
        </div>
      );
    case "link":
      return (
        <div
          className={`flex flex-col h-28 border-b ${theme.border} hover:${theme.background.darker} justify-center`}
        >
          <div className="flex flex-row mx-5 justify-between">
            <div className="flex flex-col justify-center">
              <p className={`text-2xl`}>Link</p>
              <p className={"text-lg"}>name: {file.name}</p>
            </div>
            <div className="flex flex-col justify-center">
              <p
                className={`text-xl cursor-pointer`}
                onClick={() => handleOpenLink()}
              >
                Open Link
              </p>
            </div>
          </div>
        </div>
      );
    default:
      return (
        <div
          className={`flex flex-col h-28 border-b ${theme.border} hover:${theme.background.darker}`}
        >
          <div className="flex">S</div>
        </div>
      );
  }
}
