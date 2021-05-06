import axios from "axios";
import React, { useEffect, useState } from "react";
import { SingleUser } from "../../Interfaces";
import { baseurl } from "../../routes";

export default function UserSelector({
  ids,
  selected,
  setSelected,
}: {
  ids: string[];
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [users, setUsers] = useState<SingleUser[]>();

  useEffect(() => {
    const fetchUsers = async () => {
      const resUsers = await axios.post<SingleUser[]>(
        `${baseurl}/teams/fetchteammembers`,
        { ids },
        { withCredentials: true }
      );
      setUsers(resUsers.data);
    };
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mapMembers = users?.map((user: any) => {
    return (
      <>
        <input
          key={user.id}
          type="checkbox"
          className=" checked:bg-blue-600 checked:border-transparent m-3"
          onChange={() => {
            if (!selected?.includes(user.id)) {
              setSelected([...selected, user.id]);
            } else {
              setSelected(selected!.filter((item: any) => item !== user.id));
            }
          }}
        />
        {user.name}({user.username})
      </>
    );
  });

  return <div>{mapMembers}</div>;
}
