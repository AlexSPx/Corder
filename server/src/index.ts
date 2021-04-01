import authUser from "./api/user";
import refresh from "./api/refreshing";
import teams from "./api/teams";
import projects from "./api/projects";
import files from "./api/files";
import assignment from "./api/assignments";

import { User } from "./entities/userEntity";
import { Team } from "./entities/teamEntity";
import { Invites } from "./entities/invitesEntity";
import { Projects } from "./entities/ProjectEntity";
import { Files } from "./entities/fileEntity";
import { Activation } from "./entities/activationEntity";
import { Assignment } from "./entities/assignmentEntity";

import { createConnection } from "typeorm";
import cors from "cors";
import bodyparser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

(async () => {
  //connect to db
  await createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: process.env.DATABASE_PASSWORD,
    database: "cms-ntit",
    synchronize: true,
    entities: [User, Team, Invites, Projects, Activation, Files, Assignment],
  })
    .then(() => console.log("Connected to the DB"))
    .catch((err) => {
      console.log(err);
      console.log("Could not connect to the DB");
    });

  const app = require("express")();
  const http = require("http").Server(app);
  const io = require("socket.io")(http, {
    cors: {
      origin: ["https://localhost:3000/word", "https://localhost:3006/"],
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
  });
  const port: Number = 5001;

  app.use(
    cors({
      origin: [
        "http://localhost:5000",
        "http://localhost:3000",
        "http://localhost:3006",
      ],
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(bodyparser.urlencoded({ extended: true }));
  app.use(bodyparser.json());

  //sockets
  io.on("connection", (socket: { on: any }) => {
    socket.on("new-operations", (data: any) => {
      io.emit(`new-remote-operations-${data.docid}`, data);
    });
  });

  //routes
  app.use("/api/authuser", authUser);
  app.use("/api/token_refresh", refresh);
  app.use("/api/teams", teams);
  app.use("/api/projects", projects);
  app.use("/api/files", files);
  app.use("/api/assignment", assignment);

  http.listen(port || 5001, () => console.log(`running on port ${port}`));
})();
