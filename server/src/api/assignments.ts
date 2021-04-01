import { Router } from "express";
import {
  createAssignment,
  fetchAssignments,
  fetchOneAssignment,
  fetchUserAssignments,
} from "../functions/assignmentFunc";
import { isAuth } from "../functions/tokenFunc";

const router = Router();

router.post("/create", isAuth, async (req, res) => {
  const status = await createAssignment(req.body);

  if (status) {
    res.status(200).send(true);
  } else {
    res.status(401).send(false);
  }
});

router.get("/fetchassignments/:id", isAuth, async (req, res) => {
  const { status, assignments, errors } = await fetchAssignments(req.params.id);

  if (status) {
    res.status(200).json(assignments);
  } else {
    res.json(401).json(errors);
  }
});

router.get("/fetchoneassignment/:id", isAuth, async (req, res) => {
  const { status, assignment, errors } = await fetchOneAssignment(
    req.params.id
  );

  if (status) {
    res.status(200).json(assignment);
  } else {
    res.json(401).json(errors);
  }
});

router.get("/fetchuser", isAuth, async (req, res) => {
  const { status, assignments, errors } = await fetchUserAssignments(
    req.body.user.id
  );

  if (status) {
    res.status(200).send(assignments);
  } else {
    res.status(401).send(errors);
  }
});

export default router;
