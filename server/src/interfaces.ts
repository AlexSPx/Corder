export interface onlineUser {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar: Buffer;
}

export interface IncomingMessageInterface {
  message: string;
  roomid: string;
  userid: string;
}

export interface regForm {
  username: String;
  name: String;
  email: String;
  password: String;
  passwordCheck: String;
}

export interface loginForm {
  username: String;
  password: String;
}
