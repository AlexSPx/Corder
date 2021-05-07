import { Router } from "express";
import { Chatroom } from "../entities/chatroomEntity";
import { getRepository } from "typeorm";
import { CreateChatRoom, fetchChatRooms } from "../functions/chatFunc";
import { isAuth } from "../functions/tokenFunc";
import { upload } from "../multerConfig";
import { getLatestMessages } from "../functions/messagesFunc";

const router = Router();

router.post("/create", isAuth, async (req, res) => {
  const { status, errors, id } = await CreateChatRoom(req.body);

  if (status) {
    res.status(200).send(id);
  } else {
    res.status(401).json(errors);
  }
});

router.get("/fetch/:id", isAuth, async (req, res) => {
  const { status, rooms, errors } = await fetchChatRooms(req.params.id);

  if (status) {
    res.status(200).json(rooms);
  } else {
    res.status(401).json(errors);
  }
});

router.post(
  "/changeimg/:roomid",
  upload.single("image"),
  isAuth,
  async (req, res) => {
    try {
      const userRepository = await getRepository(Chatroom);

      await userRepository
        .createQueryBuilder()
        .update()
        .set({ image: req.file.buffer })
        .where({ id: req.params.roomid })
        .execute();

      res.status(200).send(true);
    } catch (err) {
      res.status(401).send(false);
    }
  }
);

router.get("/messages/fetch/:id/:off", isAuth, async (req, res) => {
  try {
    const { status, messages, count, errors } = await getLatestMessages({
      roomid: req.params.id,
      off: parseInt(req.params.off),
    });

    if (status) {
      if (count) res.status(200).json({ count, messages });
      else res.status(200).json(messages);
    } else {
      res.status(401).json(errors);
    }
  } catch (err) {
    console.log(err);
  }
});

export default router;
