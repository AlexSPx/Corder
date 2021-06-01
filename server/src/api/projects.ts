import express from "express";
import { send } from "process";
import {
  createProject,
  fetchProject,
  fetchProjectByMember,
  fetchProjectByName,
  fetchProjectMembers,
  fetchTeamProjects,
  saveChanges,
} from "../functions/projectFunc";
import { isAuth } from "../functions/tokenFunc";

const router = express.Router();

router.post("/create", isAuth, async (req, res) => {
  const { status, project, errors } = await createProject(req.body);

  if (status) {
    res.status(200).json(project);
  } else {
    res.status(401).json(errors);
  }
});

router.get("/fetchteamprojects/:teamid", isAuth, async (req, res) => {
  const { status, projects, errors } = await fetchTeamProjects(
    req.params.teamid
  );

  if (status) {
    res.status(200).json(projects);
  } else {
    res.status(401).json(errors);
  }
});

router.get("/fetchteamproject/:id", isAuth, async (req, res) => {
  const id = req.params.id;

  const { members, status, errors } = await fetchProjectMembers(id);

  if (status) {
    res.status(200).json(members);
  } else {
    res.status(401).json(errors);
  }
});

router.get("/fetchproject/:id", isAuth, async (req, res) => {
  const { status, errors, project } = await fetchProject(req.params.id);

  if (status) {
    res.status(200).json(project);
  } else {
    res.status(401).json(errors);
  }
});

router.post("/fetchprojectsbymembers", isAuth, async (req, res) => {
  const { status, errors, projects } = await fetchProjectByMember(req.body);

  if (status) {
    res.status(200).json(projects);
  } else {
    res.status(401).json(errors);
  }
});

router.get("/fetchproject/:team/:name", isAuth, async (req, res) => {
  const { status, project, errors } = await fetchProjectByName(
    req.params.team,
    req.params.name
  );

  if (status) {
    res.status(200).json(project);
  } else {
    res.status(401).json(errors);
  }
});

router.post("/changes", isAuth, async (req, res) => {
  const { status, errors } = await saveChanges(req.body);

  if (status) {
    res.status(200).send(true);
  } else {
    res.status(401).json(errors);
  }
});

export default router;
