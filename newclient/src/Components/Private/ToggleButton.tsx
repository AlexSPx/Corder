import React, { useState } from "react";

export default function ToggleButton({ onChange, value }: any) {
  return (
    <div
      className={`flex w-12 h-6 rounded-full bg-gray-200 m-1 items-center cursor-pointer ${
        value ? `justify-end` : `justify-start`
      }`}
      onClick={() => {
        onChange(!value);
      }}
    >
      {value ? <Activated /> : <Deactivated />}
    </div>
  );
}

const Activated = () => {
  return <div className="flex h-5 w-5 rounded-full bg-green-300 m-1"></div>;
};

const Deactivated = () => {
  return <div className="flex h-5 w-5 rounded-full bg-red-300 m-1"></div>;
};
