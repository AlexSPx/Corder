import React from "react";
import { useHistory } from "react-router-dom";

export const Button = ({
  label,
  to,
  css,
}: {
  label: string;
  to: string;
  css: string;
}) => {
  const history = useHistory();

  const goto = (to: string) => history.push(to);
  return (
    <div className={`cursor-pointer ${css}`} onClick={() => goto(to)}>
      {label}
    </div>
  );
};
