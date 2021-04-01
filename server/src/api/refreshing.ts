import { Router } from "express";
import { verify } from "jsonwebtoken";
import { User } from "../entities/userEntity";
import { getRepository } from "typeorm";
import { createAccessToken, createRefreshToken } from "../functions/tokenFunc";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const token = req.cookies.jid;

    if (!token) {
      res.status(401).json({ error: "not authenticated" });
    }

    const payload: any = verify(token, process.env.REFRESH_TOKEN_SECRET!);

    const userRepository = getRepository(User);

    const user = await userRepository.findOne({ id: payload.userID });

    if (!user) {
      res.status(401).json({ error: "user not found" });
    }

    if (user?.tokenVersion !== payload.tokenVersion) {
      res.status(401).json({ error: "invalid token" });
    }

    res
      .cookie("jid", createAccessToken(user!), {
        httpOnly: true,
      })
      .cookie("_rjid", createRefreshToken(user!))
      .send();
  } catch (err) {
    res.status(401).send(err);
  }
});

export default router;
