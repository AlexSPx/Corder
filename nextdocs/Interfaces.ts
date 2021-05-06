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
