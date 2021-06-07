import React from "react";
import { useHistory } from "react-router";
import { DocumentInterface } from "../../interfaces";

export default function FileCard({
  document,
}: {
  document: DocumentInterface;
}) {
  const history = useHistory();

  return (
    <div
      className="flex flex-col w-64 h-32 border rounded-xl mx-3 my-3 hover:bg-gray-100 cursor-pointer"
      onClick={() => history.push(`/docs/${document.id}`)}
    >
      <div className="flex flex-col p-3">
        <p className="text-lg italic">Name:</p> <p>{document.name}</p>
      </div>
    </div>
  );
}
