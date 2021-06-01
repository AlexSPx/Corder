import axios from "axios";
import React, { useEffect } from "react";
import {
  AssignmentInterface,
  ProjectInterface,
  TeamInterface,
} from "../../../Interfaces";
import { baseurl } from "../../../routes";

interface TPAQuery {
  option: "Team" | "Project" | "Assignment";
  amount: "One" | "Many";
  team?: string;
  setData?: any;
  name?: string;
  aoptions?: AssignmentOptions;
}

interface AssignmentOptions {
  project_id: string;
  admin: boolean;
  setAssignments: any;
  setCollectors?: any;
}

export default function useTPAQuery({
  option,
  amount,
  team,
  setData,
  name,
  aoptions,
}: TPAQuery) {
  useEffect(() => {
    const fetchData = async () => {
      if (amount === "One") {
        if (option === "Team") {
          const res = await axios.get<TeamInterface>(
            `${baseurl}/teams/fetchteambyname/${team}`,
            { withCredentials: true }
          );
          setData(res.data);
        } else if (option === "Project") {
          const res = await axios.get<ProjectInterface>(
            `${baseurl}/projects/fetchproject/${team}/${name}`,
            { withCredentials: true }
          );
          setData(res.data);
        } else if (option === "Assignment") {
          const res = await axios.get<AssignmentInterface>(
            `${baseurl}/assignment/fetchassignment/${team}/${name}`,
            { withCredentials: true }
          );
          setData(res.data);
        }
      } else if (amount === "Many") {
        if (option === "Team") {
          const res = await axios.get<TeamInterface>(
            `${baseurl}/teams/fetchteambyname/${team}`,
            { withCredentials: true }
          );
          setData(res.data);
        } else if (option === "Project") {
          const res = await axios.get<ProjectInterface[]>(
            `${baseurl}/projects/fetchteamprojects/${team}`,
            { withCredentials: true }
          );
          setData(res.data);
        } else if (option === "Assignment") {
          if (aoptions?.admin) {
            const assignments = await axios.get(
              `${baseurl}/assignment/fetchassignments/admin/${aoptions?.project_id}`,
              { withCredentials: true }
            );

            aoptions.setAssignments(assignments.data.assignments);
            aoptions.setCollectors(assignments.data.collectors);
          } else {
            const assignments = await axios.post<AssignmentInterface[]>(
              `${baseurl}/assignment/fetchassignments/${aoptions?.project_id}`,
              { withCredentials: true }
            );

            aoptions?.setAssignments(assignments.data);
          }
        }
      }
    };

    fetchData();
  }, [team, aoptions?.project_id]);

  return {};
}
