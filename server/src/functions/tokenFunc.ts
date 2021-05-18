import { decode, sign, verify } from "jsonwebtoken";
import { User } from "../entities/userEntity";
import { Request, Response, NextFunction } from "express";
import { getConnection, getRepository } from "typeorm";

export interface tokenInf {
  id: String;
  username: String;
  name: String;
  email: String;
  isActivated: Boolean;
  isAdmin: Boolean;
  tokenVersion?: Number;
}

export const createAccessToken = (user: tokenInf) => {
  return sign(
    {
      id: user.id,
      email: user.email.toLowerCase(),
      name: user.name,
      username: user.username.toLowerCase(),
      isActivated: user.isActivated,
      isAdmin: user.isAdmin,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "20s",
    }
  );
};

export const createRefreshToken = (user: tokenInf) => {
  return sign(
    {
      id: user.id,
      email: user.email.toLowerCase(),
      username: user.username.toLowerCase(),
      name: user.name,
      isActivated: user.isActivated,
      isAdmin: user.isAdmin,
      tokenVersion: user.tokenVersion,
    },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "7d",
    }
  );
};

export const verifyRefreshToken = (token: any) => {
  return verify(token, process.env.REFRESH_TOKEN_SECRET!);
};

export const verifyAccessToken = (token: any) => {
  return verify(token, process.env.ACCESS_TOKEN_SECRET!);
};

export const revokeRefreshToken = async (userID: string) => {
  await getConnection()
    .getRepository(User)
    .increment({ id: userID }, "tokenVersion", 1);

  return true;
};

export const refreshTokens = async (id: string): Promise<any> => {
  try {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { id: id } });

    return {
      accessToken: createAccessToken(user!),
      refreshToken: createRefreshToken(user!),
    };
  } catch (err) {
    return { accessToken: null, refreshToken: null };
  }
};

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { exp: jid_exp } = decode(req.cookies.jid) as any;

    if (Date.now() >= jid_exp * 1000 || jid_exp == null) {
      const { exp: _rjid_exp } = decode(req.cookies._rjid) as any;
      if (!(Date.now() >= _rjid_exp * 1000 || _rjid_exp == null)) {
        const user = verifyRefreshToken(req.cookies._rjid) as any;

        const userRepository = getRepository(User);

        const newUserData = await userRepository
          .createQueryBuilder()
          .select([
            "User.id",
            "User.name",
            "User.username",
            "User.email",
            "User.isActivated",
            "User.isAdmin",
          ])
          .where("User.id = :id", { id: user.id })
          .getOne();

        req.body.user = newUserData;
        res
          .cookie("jid", createAccessToken(newUserData!))
          .cookie("_rjid", createRefreshToken(newUserData!));

        next();
      } else {
        res.status(401).send(false);
      }
    } else {
      const user = verifyAccessToken(req.cookies.jid) as any;

      const userRepository = getRepository(User);

      const newUserData = await userRepository
        .createQueryBuilder()
        .select([
          "User.id",
          "User.name",
          "User.username",
          "User.email",
          "User.isActivated",
          "User.isAdmin",
        ])
        .where("User.id = :id", { id: user.id })
        .getOne();

      req.body.user = newUserData;
      res.cookie("jid", createAccessToken(newUserData!));

      next();
    }
  } catch (err) {
    res.status(401).send(false);
  }
};

// Date.now() >= exp * 1000
