import React, { useState } from "react";
import { DownArrow, UpArrow } from "../../public/SmallSvgs";

export default function DropdownSelector({
  options,
  selected,
  setSelector,
}: {
  options: string[];
  selected: string | undefined;
  setSelector: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
  const [activated, setActivated] = useState(false);

  const mapItems = options.map((item) => {
    return (
      <div
        className="flex p-1 cursor-pointer border-t hover:bg-gray-100"
        onClick={() => {
          setSelector(item);
          setActivated(false);
        }}
      >
        <p className="text-md opacity-80 p-1">{item}</p>
      </div>
    );
  });

  return (
    <div className={`flex w-full justify-center`}>
      <div className="flex flex-col border rounded w-4/5">
        <div className="flex justify-between items-center w-full">
          <p className="text-lg p-1 ">
            {selected ? selected : "Select a type"}
          </p>

          <div
            className="cursor-pointer"
            onClick={() => setActivated(!activated)}
          >
            {activated ? <UpArrow /> : <DownArrow />}
          </div>
        </div>
        {activated && <div className="w-full ">{mapItems}</div>}
      </div>
    </div>
  );
}
