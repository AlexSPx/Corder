export interface userDataInterface {
  id: string;
  email: string;
  username: string;
  name: string;
  avatar: any;
  isActivated: boolean;
  isAdmin: boolean;
  iat: bigint;
  exp: bigint;
}

export interface userContextInterface {
  userData: userDataInterface;
  setUserData: any;
}

export interface DocumentInterface {
  id: string;
  file: string;
  members: string[];
  name: string;
  teamID: string;
  type: "document";
}
