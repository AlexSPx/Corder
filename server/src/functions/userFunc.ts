import { getRepository } from "typeorm";
import { User } from "../entities/userEntity";
import { hash, compare } from "bcrypt";

import { v4 as uuidv4 } from "uuid";
import { createAccessToken, createRefreshToken } from "./tokenFunc";
import { Activation } from "../entities/activationEntity";
import {
  changeEmailCode,
  changePasswordCode,
  mailActivationCode,
} from "../mailer";
import { loginForm, regForm } from "../interfaces";

export async function authReg(data: regForm): Promise<any> {
  try {
    let errors = {};

    const { username, name, email, password, passwordCheck } = data;

    //validations
    if (password != passwordCheck) {
      errors = { error: "password do not match" };
      return { isValid: false, errors };
    }

    const userRepository = getRepository(User);
    const activationRepository = getRepository(Activation);

    const usernameCheck = await userRepository.findOne({
      where: { username: username.toLowerCase() },
    });
    if (usernameCheck) {
      errors = { error: "username already in use" };
      return { isValid: false, errors };
    }

    const emailCheck = await userRepository.findOne({
      where: { email: email.toLowerCase() },
    });
    if (emailCheck) {
      errors = { error: "email already in use" };
      return { isValid: false, errors };
    }

    const hashedPassword = await hash(password, 12);

    const id = uuidv4();
    const actid = uuidv4();

    //insert
    await userRepository.insert({
      id,
      username: username.toLowerCase(),
      name: name.toString(),
      email: email.toLowerCase(),
      password: hashedPassword,
      isActivated: false,
      isAdmin: false,
      avatar: null,
    });

    //create activation key
    await activationRepository.insert({
      id: actid,
      userID: id,
    });

    //kopele nz zashto s gornoto ne bachka ama it is what it is, I wanna die
    const user: User = {
      id,
      username: username.toLowerCase(),
      name: name.toString(),
      email: email.toLowerCase(),
      password: hashedPassword,
      isActivated: false,
      isAdmin: false,
      tokenVersion: 0,
      avatar: null,
    };

    //generate jwt
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    await mailActivationCode(email.toString(), actid);

    return {
      isValid: true,
      errors,
      accessToken,
      refreshToken,
    };
  } catch (err) {
    let errors = { error: "something went wrong" };
    return { isValid: false, errors };
  }
}

export async function activation(data: {
  userid: String;
  code: String;
}): Promise<any> {
  try {
    const { userid, code } = data;

    const activationRepository = getRepository(Activation);

    const actreq = await activationRepository.findOne({
      where: { userID: userid },
    });

    if (actreq?.id == code) {
      const userRepository = getRepository(User);
      await userRepository
        .createQueryBuilder()
        .update()
        .set({ isActivated: true })
        .where({ id: userid })
        .execute();

      await activationRepository
        .createQueryBuilder()
        .delete()
        .where({ id: code })
        .execute();
    }

    return { isValid: true };
  } catch (err) {
    return { isValid: false, errors: err };
  }
}

export async function authLogin(data: loginForm): Promise<any> {
  let errors = {};
  try {
    const { username, password } = data;

    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
      where: { username: username.toLowerCase() },
    });
    if (!user) {
      errors = { error: "There is not a user with that username" };
      return { isValid: false, errors };
    }

    const valid = await compare(password, user.password);

    if (!valid) {
      errors = { error: "wrong password" };
      return { isValid: false, errors };
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    return {
      isValid: true,
      accessToken,
      refreshToken,
    };
  } catch (err) {
    return { isValid: false, error: err };
  }
}

export async function saveChanges(data: any) {
  try {
    const { user, newName, newUsername } = data;

    const changes = <Chnages>{};

    if (user.name !== newName) {
      changes.name = newName;
    }
    if (user.username !== newUsername) {
      changes.username = newUsername;
    }

    const userRepository = getRepository(User);

    await userRepository
      .createQueryBuilder()
      .update()
      .set(changes as any)
      .where("id = :id", { id: user.id })
      .execute();
    return { isValid: true };
  } catch (err) {
    return { isvalid: false, errors: err };
  }
}

interface Chnages {
  name: String;
  username: String;
}

export async function resendCode(data: any) {
  try {
    const { id, email } = data;
    const activationRepository = getRepository(Activation);

    const actid = await activationRepository.findOne({
      where: { userID: id },
      select: ["id"],
    });

    await mailActivationCode(email.toString(), actid?.id as string);

    return { isValid: true };
  } catch (err) {
    return { isValid: false, errors: err };
  }
}

export async function cPassword(password: string, id: string) {
  try {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ id });

    const passwordCheck = await compare(password, user?.password!);

    if (passwordCheck) {
      return { isValid: true, status: true };
    }
    return { isValid: true, status: false };
  } catch (err) {
    return { isValid: false, errors: err };
  }
}

const tempEmail = new Map();

export const changeEmail = async (email: string) => {
  try {
    const code = uuidv4();
    tempEmail.set(code, email);

    await changeEmailCode(email, code);

    return { isValid: true };
  } catch (err) {
    return { isValid: false, errors: err };
  }
};

export const confrimEmailChange = async (userid: string, code: string) => {
  try {
    if (!tempEmail.has(code)) {
      return { isValid: true, status: false };
    }

    const email = tempEmail.get(code);

    const userRepository = getRepository(User);

    await userRepository
      .createQueryBuilder()
      .update()
      .set({ email })
      .where("id = :id", { id: userid })
      .execute();

    return { isValid: true, status: true };
  } catch (err) {
    return { isValid: false, errors: err };
  }
};

const tempPassword = new Map();

export const changePassword = async (password: string, email: string) => {
  try {
    const code = uuidv4();
    tempPassword.set(code, password);

    await changePasswordCode(email, code);

    return { isValid: true };
  } catch (err) {
    return { isValid: false, errors: err };
  }
};

export const confrimPasswordChange = async (userid: string, code: string) => {
  try {
    if (!tempPassword.has(code)) {
      return { isValid: true, status: false };
    }

    const password = tempPassword.get(code);

    const userRepository = getRepository(User);

    const hashedPassword = await hash(password, 12);

    await userRepository
      .createQueryBuilder()
      .update()
      .set({ password: hashedPassword })
      .where("id = :id", { id: userid })
      .execute();

    return { isValid: true, status: true };
  } catch (err) {
    return { isValid: false, errors: err };
  }
};
