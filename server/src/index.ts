import authUser from "./api/user";
import refresh from "./api/refreshing";
import teams from "./api/teams";
import projects from "./api/projects";
import files from "./api/files";
import assignment from "./api/assignments";
import chats from "./api/chats";

import { User } from "./entities/userEntity";
import { Team } from "./entities/teamEntity";
import { Invites } from "./entities/invitesEntity";
import { Projects } from "./entities/ProjectEntity";
import { Files } from "./entities/fileEntity";
import { Activation } from "./entities/activationEntity";
import { Assignment } from "./entities/assignmentEntity";
import { AssignmentsCollector } from "./entities/assignmentsCollectorEntity";

import { createConnection } from "typeorm";
import cors from "cors";
import bodyparser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { addUser, removeUser } from "./online";
import { Message } from "./entities/messageEntity";
import { Chatroom } from "./entities/chatroomEntity";
import { addMessage } from "./functions/messagesFunc";
import { IncomingMessageInterface, onlineUser } from "./interfaces";
import { saveDocs } from "./functions/fileFunc";

dotenv.config();

(async () => {
  //connect to db
  await createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: process.env.DATABASE_PASSWORD,
    database: "corder",
    synchronize: true,
    entities: [
      User,
      Team,
      Invites,
      Projects,
      Activation,
      Files,
      Assignment,
      AssignmentsCollector,
      Message,
      Chatroom,
    ],
  })
    .then(() => console.log("Connected to the DB"))
    .catch((err) => {
      console.log(err);
      console.log("Could not connect to the DB");
    });

  const app = require("express")();
  const http = createServer(app);
  const io = new Server(http, {
    cors: { origin: "*" },
  });
  const port: Number = 5001;

  app.use(
    cors({
      origin: [
        "http://localhost:5000",
        "http://localhost:3000",
        "http://localhost:3006",
        "https://docs.corder-bg.xyz/",
      ],
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(bodyparser.urlencoded({ limit: "50mb", extended: true }));
  app.use(bodyparser.json({ limit: "50mb" }));

  //sockets
  io.on("connection", (socket: Socket) => {
    socket.on("conn", ({ user }: { user: onlineUser }) => {
      addUser(socket.id, user);
    });

    // messages
    socket.on("send-message", (data: IncomingMessageInterface) => {
      const { id } = addMessage(data);

      const messageres = {
        id,
        message: data.message,
        roomid: data.roomid,
        userid: data.userid,
      };

      io.emit(`remote-message-${data.roomid}`, messageres);
    });

    socket.on("start-typing", (data: { userid: string; roomid: string }) => {
      socket.broadcast.emit(`start-typing-${data.roomid}`, data);
    });
    socket.on("stop-typing", (id: string) => {
      socket.broadcast.emit("stop-typing", id);
    });

    // docs
    socket.on("docs-change", (data: { delta: any; id: string }) => {
      socket.broadcast.emit(`remote-change-${data.id}`, data.delta);
    });

    socket.on("save-document", (data: { file: any; id: string }) => {
      saveDocs(data);
    });

    socket.on("disconnect", () => {
      removeUser(socket.id);
    });
  });

  //routes
  app.use("/api/authuser", authUser);
  app.use("/api/token_refresh", refresh);
  app.use("/api/teams", teams);
  app.use("/api/projects", projects);
  app.use("/api/files", files);
  app.use("/api/assignment", assignment);
  app.use("/api/chat", chats);

  http.listen(port || 5001, () => console.log(`running on port ${port}`));
})();
