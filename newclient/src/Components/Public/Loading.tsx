import React from "react";

export const Loading = ({ css }: { css?: string }) => {
  return (
    <div
      className={`loader ease-linear rounded-full border-2 border-t-2 border-gray-200 h-32 w-32 ${css}`}
    ></div>
  );
};

export const LoadingFlexCenter = ({ css }: { css?: string }) => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <div
        className={`loader ease-linear rounded-full border-2 border-t-2 border-gray-200 ${css}`}
      ></div>
    </div>
  );
};
