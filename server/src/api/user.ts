import { Router } from "express";
import {
  activation,
  authLogin,
  authReg,
  changeEmail,
  changePassword,
  confrimEmailChange,
  confrimPasswordChange,
  cPassword,
  resendCode,
  saveChanges,
} from "../functions/userFunc";
import { isAuth, refreshTokens } from "../functions/tokenFunc";
import { upload } from "../multerConfig";
import { getRepository } from "typeorm";
import { User } from "../entities/userEntity";

const router = Router();

router.post("/register", upload.single("avatar"), async (req, res) => {
  const { isValid, errors, accessToken, refreshToken } = await authReg(
    req.body
  );
  if (isValid) {
    res
      .status(200)
      .cookie("jid", accessToken, {
        httpOnly: true,
        sameSite: "strict",
      })
      .cookie("_rjid", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
      })
      .send(true);
  } else {
    res.json(errors);
  }
});

router.post("/login", async (req, res) => {
  const { isValid, errors, accessToken, refreshToken } = await authLogin(
    req.body
  );

  if (isValid) {
    res
      .status(200)
      .cookie("jid", accessToken, {
        httpOnly: true,
        sameSite: "strict",
      })
      .cookie("_rjid", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
      })
      .send(true);
  } else {
    res.status(401).json(errors);
  }
});

router.post("/activate", async (req, res) => {
  const { isValid } = await activation(req.body);

  if (isValid) {
    const { refreshToken, accessToken } = await refreshTokens(req.body.userid);
    res
      .status(200)
      .cookie("jid", accessToken)
      .cookie("_rjid", refreshToken)
      .json(true);
  } else {
    res.status(401).json(false);
  }
});

router.get("/signout", isAuth, async (_, res) => {
  res.clearCookie("jid").clearCookie("_rjid").status(200).send(true);
});

router.get("/fetchuser", isAuth, async (req, res) => {
  res.status(200).send(req.body.user);
});

router.post("/changepfp", upload.single("avatar"), isAuth, async (req, res) => {
  try {
    const userRepository = await getRepository(User);

    const pl = await userRepository
      .createQueryBuilder()
      .update()
      .set({ avatar: req.file.buffer })
      .where({ id: req.body.user.id })
      .execute();

    res.status(201).json(true);
  } catch (error) {
    res.status(401).json(false);
  }
});

router.get("/getpfp", isAuth, async (req, res) => {
  try {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
      where: { id: req.body.user.id },
    });

    res.status(200).send(user?.avatar);
  } catch (err) {
    res.status(401).send(false);
  }
});

router.post("/changes", isAuth, async (req, res) => {
  const { isValid, errors } = await saveChanges(req.body);

  if (isValid) {
    res.sendStatus(200);
  } else {
    res.status(401).json(errors);
  }
});

//router.get("/test", (req, res) => {});

router.post("/resendcode", isAuth, async (req, res) => {
  const { isValid, errors } = await resendCode(req.body);

  if (isValid) {
    res.sendStatus(200);
  } else {
    res.status(401).send(errors);
  }
});

router.post("/cpassword", isAuth, async (req, res) => {
  const { isValid, errors, status } = await cPassword(
    req.body.password,
    req.body.user.id
  );

  if (isValid) {
    res.status(200).send(status);
  } else {
    res.status(401).send(errors);
  }
});

router.get("/changes/email/:email", isAuth, async (req, res) => {
  const { isValid, errors } = await changeEmail(req.params.email);
  if (isValid) {
    res.status(200).send(true);
  } else {
    res.status(401).send(errors);
  }
});

router.get("/changes/email/:code/confirm", isAuth, async (req, res) => {
  const { isValid, errors, status } = await confrimEmailChange(
    req.body.user.id,
    req.params.code
  );
  if (isValid) {
    res.status(200).send(status);
  } else {
    res.status(401).send(errors);
  }
});

router.get("/changes/password/:password", isAuth, async (req, res) => {
  const { isValid, errors } = await changePassword(
    req.params.password,
    req.body.user.email
  );
  if (isValid) {
    res.status(200).send(true);
  } else {
    res.status(401).send(errors);
  }
});

router.get("/changes/password/:code/confirm", isAuth, async (req, res) => {
  const { isValid, errors, status } = await confrimPasswordChange(
    req.body.user.id,
    req.params.code
  );
  if (isValid) {
    res.status(200).clearCookie("jid").clearCookie("_rjid").send(status);
  } else {
    res.status(401).send(errors);
  }
});

export default router;
