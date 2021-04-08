import express from "express";
import { isAuth } from "../functions/tokenFunc";
import {
  createTeam,
  fetchInvites,
  fetchTeam,
  fetchTeams,
  invres,
  fetchTeamByName,
  fetchTeamMembers,
  fetchTeamAdmins,
  saveChanges,
} from "../functions/teamFunc";
import { upload } from "../multerConfig";
import { getRepository } from "typeorm";
import { Team } from "../entities/teamEntity";
import { getAllOnline } from "../online";

const router = express.Router();

router.post("/create", isAuth, async (req, res) => {
  const { status, errors, teamID } = await createTeam(req.body);

  if (status) {
    res.status(200).json(teamID).send();
  } else {
    res.status(401).json(errors).send();
  }
});

router.get("/myinvites", isAuth, async (req, res) => {
  const { status, invites, errors } = await fetchInvites(req.body);

  if (status) {
    res.json(invites);
  } else {
    res.status(401).json(errors);
  }
});

router.get("/myteams", isAuth, async (req, res) => {
  const { status, errors, teams } = await fetchTeams(req.body);

  if (status) {
    res.status(200).send(teams);
  } else {
    res.status(401).send(errors);
  }
});

router.post("/fetchteam", isAuth, async (req, res) => {
  const { status, errors, team } = await fetchTeam(req.body);

  if (status) {
    res.status(200).json(team);
  } else {
    res.status(401).json(errors);
  }
});

router.post("/fetchteambyname", isAuth, async (req, res) => {
  const { status, errors, team } = await fetchTeamByName(req.body);

  if (status) {
    res.status(200).json(team);
  } else {
    res.status(401).json(errors);
  }
});

router.post("/fetchteammembers", isAuth, async (req, res) => {
  const { status, errors, members } = await fetchTeamMembers(req.body);

  if (status) {
    res.status(200).json(members);
  } else {
    res.status(401).json(errors);
  }
});

router.post("/fetchonline", isAuth, async (req, res) => {
  const whoIsOnline = getAllOnline(req.body.ids);
  res.status(200).json(whoIsOnline);
});

router.post("/fetchteamadmins", isAuth, async (req, res) => {
  const { status, errors, admins } = await fetchTeamAdmins(req.body);

  if (status) {
    res.status(200).json(admins);
  } else {
    res.status(401).json(errors);
  }
});

router.post(
  "/changeimg/:teamid",
  isAuth,
  upload.single("image"),
  async (req, res) => {
    try {
      const userRepository = await getRepository(Team);

      await userRepository
        .createQueryBuilder()
        .update()
        .set({ image: req.file.buffer })
        .where({ id: req.params.teamid })
        .execute();

      res.status(201).json(true).send();
    } catch (error) {
      res.status(401).json(false).send();
    }
  }
);

router.post("/invres", isAuth, async (req, res) => {
  const resp = await invres(req.body);

  if (resp) {
    res.send(true);
  } else {
    res.send(false);
  }
});

router.post("/savechanges", isAuth, async (req, res) => {
  const { status, errors } = await saveChanges(req.body);

  if (status) {
    res.status(200).send("saved");
  } else {
    res.status(401).send(errors);
  }
});

export default router;
