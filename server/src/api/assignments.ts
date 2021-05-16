import { Router } from "express";
import {
  createAssignment,
  createForeachAssignment,
  fetchAssignmentByName,
  fetchAssignments,
  fetchAssignmentsAdmin,
  fetchFe,
  fetchOneAssignment,
  fetchUserAssignments,
  statusChange,
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

router.post("/createforeach", isAuth, async (req, res) => {
  const status = await createForeachAssignment(req.body);

  if (status) {
    res.status(200).send(true);
  } else {
    res.status(401).send(false);
  }
});

router.post("/fetchassignments", isAuth, async (req, res) => {
  const { status, assignments, errors } = await fetchAssignments(req.body);

  if (status) {
    res.status(200).json(assignments);
  } else {
    res.json(401).json(errors);
  }
});

router.post("/changestatus/:id/", isAuth, async (req, res) => {
  const { status, errors } = await statusChange({
    id: req.params.id,
    status: req.body.status,
  });
  if (status) {
    res.sendStatus(200);
  } else {
    res.status(401).json(errors);
  }
});

router.get("/fetchassignments/admin/:id", isAuth, async (req, res) => {
  const { status, data, errors } = await fetchAssignmentsAdmin(req.params.id);

  if (status) {
    res.status(200).json(data);
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

router.get(
  "/fetchassignment/:team/:assignmentname",
  isAuth,
  async (req, res) => {
    const { status, assignment, errors } = await fetchAssignmentByName(
      req.params.team,
      req.params.assignmentname
    );

    if (status) {
      res.status(200).json(assignment);
    } else {
      res.status(401).json(errors);
    }
  }
);

router.get("/fetchfe/:team/:fename", isAuth, async (req, res) => {
  const { data, status, errors } = await fetchFe(
    req.params.team,
    req.params.fename
  );

  if (status) {
    res.status(200).json(data);
  } else {
    res.status(401).json(errors);
  }
});

export default router;
