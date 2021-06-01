import axios from "axios";
import { useEffect, useState } from "react";
import { SingleUser } from "../../../Interfaces";
import { baseurl } from "../../../routes";

export default function useFetchMembers(ids: string[]) {
  const [members, setMembers] = useState<SingleUser[]>();

  useEffect(() => {
    const fetchUsers = async () => {
      const resUsers = await axios.post(
        `${baseurl}/teams/fetchteammembers`,
        { ids },
        { withCredentials: true }
      );
      setMembers(resUsers.data);
    };
    fetchUsers();
  }, [ids]);

  return { members };
}
