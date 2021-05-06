import React from "react";

export const Loading = () => {
  return (
    <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-32 w-32"></div>
  );
};

export const LoadingFlexCenter = () => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-32 w-32"></div>
    </div>
  );
};
