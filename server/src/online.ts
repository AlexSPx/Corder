const OnlineMap = new Map();

export const addUser = (socketid: string, user: any) => {
  if (!OnlineMap.has(socketid)) {
    OnlineMap.set(socketid, user);
  }
};

export const removeUser = (socketid: string) => {
  OnlineMap.delete(socketid);
};

export const getAllOnline = (members: string[]) => {
  const whoIsOnline = new Array();

  OnlineMap.forEach((onmember) => {
    for (const [key, value] of Object.entries(onmember)) {
      if (key === "id") {
        try {
          if (members.includes(value as string)) {
            whoIsOnline.push(onmember);
          }
        } catch (err) {
          continue;
        }
      }
    }
  });

  return whoIsOnline;
};
