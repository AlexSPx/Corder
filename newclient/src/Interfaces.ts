export interface userDataInterface {
  id: String;
  email: String;
  username: String;
  name: String;
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
