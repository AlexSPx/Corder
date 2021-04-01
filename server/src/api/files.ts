import { Router } from "express";
import { save } from "../multerConfig";
import { getRepository, In } from "typeorm";
import { Files } from "../entities/fileEntity";
import { v4 as uuidv4 } from "uuid";
import { isAuth } from "../functions/tokenFunc";
import { Assignment } from "../entities/assignmentEntity";
import { readFile } from "fs/promises";
//import { docx } from "../auth/fileFunc";

const router = Router();

router.post("/test", save.single("file"), (req, res) => {
  res.sendStatus(200);
});

const initialDocData = [
  {
    type: "paragraph",
    children: [
      { text: "An opening paragraph with a " },
      {
        type: "link",
        url: "https://example.com",
        children: [{ text: "link" }],
      },
      { text: " in it." },
    ],
  },
  { type: "quote", children: [{ text: "A wise quote." }] },
  { type: "paragraph", children: [{ text: "A closing paragraph!POGGG" }] },
];

router.post("/newdoc", isAuth, async (req, res) => {
  try {
    const id = uuidv4();

    const filesRepository = getRepository(Files);
    const assignmentRepository = getRepository(Assignment);

    await filesRepository.save({
      id,
      teamID: req.body.teamid,
      file: JSON.stringify(initialDocData),
      type: "document",
      name: Date.now().toString(),
    });

    const assign = await assignmentRepository.findOne({
      where: { id: req.body.assignmentid },
    });

    const files = assign?.files;
    let newFiles: any = [];

    files?.forEach((f) => {
      newFiles.push(f);
    });
    newFiles.push(id);

    await assignmentRepository
      .createQueryBuilder()
      .update()
      .set({ files: newFiles })
      .where({ id: req.body.assignmentid })
      .execute();

    res.status(200).send(id);
  } catch (err) {
    res.sendStatus(401);
  }
});

router.get("/getdoc/:id", isAuth, async (req, res) => {
  try {
    const id = req.params.id;

    const filesRepository = getRepository(Files);
    const file = await filesRepository
      .createQueryBuilder()
      .where({ id: id })
      .getOne();

    res.status(200).json(file);
  } catch (err) {
    res.status(401).json(err);
  }
});

router.post("/fetchfiles", isAuth, async (req, res) => {
  try {
    const filesRepository = getRepository(Files);

    const files = await filesRepository.find({
      where: { id: In(req.body.ids) },
    });

    res.status(200).send(files);
  } catch (err) {
    res.status(401).send(err);
  }
});

router.post("/savedoc", isAuth, async (req, res) => {
  try {
    const filesRepository = getRepository(Files);

    await filesRepository
      .createQueryBuilder()
      .update()
      .set({ file: req.body.file })
      .where("id = :id", { id: req.body.id })
      .execute();
    res.sendStatus(200);
  } catch (err) {
    res.status(200).send(err);
  }
});

router.post("/changename", isAuth, async (req, res) => {
  try {
    const filesRepository = getRepository(Files);

    await filesRepository
      .createQueryBuilder()
      .update()
      .set({ name: req.body.newName })
      .where("id = :id", { id: req.body.id })
      .execute();

    res.status(200).send("changed");
  } catch (err) {
    res.status(401).send(err);
  }
});

router.post("/newlink", isAuth, async (req, res) => {
  try {
    const id = uuidv4();

    const filesRepository = getRepository(Files);
    const assignmentRepository = getRepository(Assignment);

    await filesRepository.save({
      id,
      teamID: req.body.teamid,
      file: req.body.link,
      type: "link",
      name: req.body.name,
    });

    const assign = await assignmentRepository.findOne({
      where: { id: req.body.assignmentid },
    });

    const files = assign?.files;
    let newFiles: any = [];

    files?.forEach((f) => {
      newFiles.push(f);
    });
    newFiles.push(id);

    await assignmentRepository
      .createQueryBuilder()
      .update()
      .set({ files: newFiles })
      .where({ id: req.body.assignmentid })
      .execute();

    res.status(200).send(id);
  } catch (err) {
    res.status(401).send(err);
  }
});

router.post("/saveword", isAuth, save.single("word"), async (req, res) => {
  try {
    const id = uuidv4();

    const filesRepository = getRepository(Files);
    const assignmentRepository = getRepository(Assignment);

    await filesRepository.save({
      id,
      teamID: req.body.teamid,
      file: req.file.path,
      type: "docx",
      name: req.file.originalname,
    });

    const assign = await assignmentRepository.findOne({
      where: { id: req.body.assignmentid },
    });

    const files = assign?.files;
    let newFiles: any = [];

    files?.forEach((f) => {
      newFiles.push(f);
    });
    newFiles.push(id);

    await assignmentRepository
      .createQueryBuilder()
      .update()
      .set({ files: newFiles })
      .where({ id: req.body.assignmentid })
      .execute();

    res.status(200).send(id);
  } catch (err) {
    res.status(401).send(err);
  }
});

router.post("/word/download", isAuth, async (req, res) => {
  try {
    const filepath = req.body.path;

    const fl = await readFile(filepath);
    res.send(fl);
  } catch (err) {
    res.send(err);
  }
});

export default router;
