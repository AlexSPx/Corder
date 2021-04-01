import React from "react";
import { ProjectInterface, ThemeInterface } from "../../Interfaces";

export default function ProjectCard({
  project,
  theme,
}: {
  project: ProjectInterface;
  theme: ThemeInterface;
}) {
  return (
    <div className={`flex h-32 border-b ${theme.border}`}>
      <div className="flex">{project.name}</div>
    </div>
  );
}
