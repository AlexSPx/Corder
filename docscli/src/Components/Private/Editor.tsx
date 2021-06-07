import React, { useCallback, useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { socket } from "../..";
import { useParams } from "react-router";
import axios from "axios";
import { baseurl } from "../../routes";
import { DocumentInterface } from "../../interfaces";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

export default function Editor() {
  const { id } = useParams() as any;

  const [quill, setQuill] = useState<Quill>();
  useEffect(() => {
    if (socket === null || quill === null) return;

    const tracker = (delta: any, oldDelta: any, source: string) => {
      if (source !== "user") return;
      socket.emit("docs-change", { delta, id });
    };

    quill?.on("text-change", tracker);

    return () => {
      quill?.off("text-change", tracker);
    };
  }, [quill, id]);

  useEffect(() => {
    const fetchInitialData = async () => {
      const res = await axios.get<DocumentInterface>(
        `${baseurl}/files/getdoc/${id}`,
        {
          withCredentials: true,
        }
      );
      quill?.setContents(JSON.parse(res.data.file));
    };

    const autoSave = setInterval(() => {
      const value = quill?.getContents();
      if (value) {
        socket.emit("save-document", { id, file: JSON.stringify(value) });
      }
    }, 5000);

    fetchInitialData();

    return () => clearInterval(autoSave);
  }, [id, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta: any) => {
      quill.updateContents(delta);
    };
    socket.on(`remote-change-${id}`, handler);

    return () => {
      socket.off(`remote-change-${id}`, handler);
    };
  }, [quill]);

  const wrapperRef = useCallback((wrapper: HTMLDivElement) => {
    if (wrapper === null) return;

    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });
    setQuill(q);
  }, []);

  return <div className="page" ref={wrapperRef}></div>;
}
