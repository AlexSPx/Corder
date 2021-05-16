import axios from "axios";
import { useEffect, useState } from "react";
import { compare } from "../../functions";
import { OnlineUserInterface } from "../../Interfaces";
import { baseurl } from "../../routes";

export default function useOnlineQuery(ids: string[], mseconds: number) {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUserInterface[]>();

  useEffect(() => {
    const fetchOnline = async () => {
      const res = await axios.post<OnlineUserInterface[]>(
        `${baseurl}/teams/fetchonline`,
        { ids },
        { withCredentials: true }
      );

      if (!compare(res.data, onlineUsers)) {
        setOnlineUsers(res.data);
      }
    };

    fetchOnline();
    const interval = setInterval(() => fetchOnline(), mseconds);
    return () => clearInterval(interval);
  }, []);

  return { onlineUsers };
}
