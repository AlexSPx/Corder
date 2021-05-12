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
