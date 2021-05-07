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

export interface themeDataInterface {
  theme: "Dark" | "Light";
  data: ThemeInterface;
}

export interface themeContextInterface {
  themeData: themeDataInterface;
  setThemeData: any;
}

export interface ThemeInterface {
  background: {
    light: string;
    darker: string;
    main: string;
    body: string;
    contrast: string;
  };
  buttonColor: string;
  text: {
    main: string;
    secondary: string;
  };
  border: string;
  profile: string;
}

export interface OnlineUserInterface {
  id: string;
  email: string;
  username: string;
  name: string;
  avatar: any;
}

export interface SingleUser {
  id: string;
  name: string;
  username: string;
  avatar: BufferM;
}

export interface SignupInterface {
  username: String;
  name: String;
  email: String;
  password: String;
  passwordCheck: String;
}

export interface ProjectInterface {
  id: string[];
  name: string;
  displayname: string | null;
  desc: string;
  members: string[];
  admins: string[];
  assignments: string[];
  status: boolean;
  range: string[];
  teamID: string[];
}

export interface TeamInterface {
  id: string;
  creator_id: string;
  name: string;
  displayname: string;
  description: TeamDescription;
  members: string[];
  admins: string[];
  image: BufferM | null;
}

interface BufferM {
  type: string;
  data: Buffer;
}

export interface TeamDescription {
  company: string;
  desc: string;
}

export interface InviteInterface {
  id: string;
  teamID: string;
  userID: string;
  status: boolean;
}

export interface AssignemntInterface {
  id: string;
  teamID: string[];
  projectID: string;
  name: string;
  status: boolean;
  range: string[] | null;
  members: string[];
  admins: string[];
  files: string[] | null;
  description: string;
}

export interface AssignmentsCollectorInterface {
  id: string;
  teamID: string[];
  projectID: string;
  name: string;
  description: string;
  status: boolean;
  range: string[];
  admins: string[];
  assignments: string[];
}

export interface FileInterface {
  id: string;
  name: string;
  teamID: string;
  file: string;
  type: "html" | "document" | "link" | "docx";
}

export interface ChatRoom {
  id: string;
  name: string;
  teamID: string[];
  members: string[];
  admins: string[];
  image: BufferM;
}

export interface MessageInterface {
  id?: string;
  message: string;
  roomid: string;
  userid: string;
}
