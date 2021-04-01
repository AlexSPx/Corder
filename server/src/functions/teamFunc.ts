import { Team } from "../entities/teamEntity";
import { getRepository, In } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Invites } from "../entities/invitesEntity";
import { User } from "../entities/userEntity";

export const createTeam = async (data: any): Promise<any> => {
  try {
    const { name, description, members, displayname } = data;

    if (!name && !description) {
      return { status: false, error: "not all fields are filled" };
    }

    const teamRepository = getRepository(Team);
    const invitesRepository = getRepository(Invites);
    const userRepository = getRepository(User);

    const avb = await teamRepository.findOne({ where: { name } });
    if (avb) {
      return { status: false, error: "name already taken" };
    }

    const invites = await userRepository.find({
      where: { email: In(members) },
      select: ["id", "email"],
    });

    const teamID = uuidv4();

    let invitesForm = [] as any;
    invites.forEach((user) => {
      invitesForm.push({
        id: uuidv4(),
        teamID,
        userID: user.id,
        status: false,
      });
    });

    const teamForm: Team = {
      id: teamID,
      creator_id: data.user.id,
      name,
      displayname,
      members: [data.user.id],
      description,
      admins: [data.user.id],
      image: null,
    };

    teamRepository.createQueryBuilder().insert().values(teamForm).execute();

    invitesRepository
      .createQueryBuilder()
      .insert()
      .values(invitesForm)
      .execute();

    return { status: true, teamID };
  } catch (err) {
    return { errors: err, status: false };
  }
};

export const fetchInvites = async (data: any) => {
  try {
    const invitesRepository = getRepository(Invites);

    const invites = await invitesRepository.find({
      where: { userID: data.user.id },
    });

    return { status: true, invites };
  } catch (err) {
    return { errors: err, status: false };
  }
};

export const invres = async (data: any) => {
  try {
    const { invid, userid, status } = data;

    const invitesRepository = getRepository(Invites);
    const invite = (await invitesRepository.findOne({
      where: { id: invid },
    })) as any;

    if (status) {
      //accepted

      const teamRepository = getRepository(Team);

      const team = await teamRepository.findOne({
        where: { id: invite.teamID },
      });

      const mmbrs = team?.members;
      let newMembers: any = [];

      mmbrs!.forEach((mmbr) => {
        newMembers.push(mmbr);
      });
      newMembers.push(userid);

      await teamRepository
        .createQueryBuilder()
        .update()
        .set({ members: newMembers })
        .where({ id: team?.id })
        .execute();
      await invitesRepository
        .createQueryBuilder()
        .update()
        .set({ status: true })
        .where({ id: invid })
        .execute();

      return true;
    } else {
      //declined
      await invitesRepository
        .createQueryBuilder()
        .delete()
        .where({ id: invid })
        .delete()
        .execute();
      return true;
    }
  } catch (err) {
    return false;
  }
};

export const fetchTeam = async (data: any) => {
  try {
    const { teamid } = data;

    if (!teamid) {
      return { status: false, errors: "id was not provided" };
    }

    const teamRepository = getRepository(Team);

    const team = await teamRepository.find({ where: { id: teamid } });

    if (!team) {
      return { status: false, errors: "team not found" };
    }

    return { status: true, team };
  } catch (err) {
    return { status: false, errors: err };
  }
};

export const fetchTeamByName = async (data: any) => {
  try {
    const { name } = data;

    if (!name) {
      return { status: false, errors: "name was not provided" };
    }

    const teamRepository = getRepository(Team);

    const team = await teamRepository.find({ where: { name: name } });

    if (!team) {
      return { status: false, errors: "team not found" };
    }

    return { status: true, team };
  } catch (err) {
    return { status: false, errors: err };
  }
};

export const fetchTeams = async (data: any) => {
  try {
    const teamRepository = getRepository(Team);

    const teams = await teamRepository
      .createQueryBuilder()
      .where("members @> ARRAY[:members]", { members: data.user.id })
      .getMany();

    return { status: true, teams };
  } catch (err) {
    return { status: false, errors: err };
  }
};

export const fetchTeamMembers = async (data: any) => {
  try {
    const { ids } = data;

    const userRepository = getRepository(User);

    const members = await userRepository.find({
      where: { id: In(ids) },
      select: ["id", "name", "username", "avatar"],
    });

    return { status: true, members };
  } catch (err) {
    return { status: false, errors: err };
  }
};

export const fetchTeamAdmins = async (data: any) => {
  try {
    const { ids } = data;

    const userRepository = getRepository(User);

    const admins = await userRepository.find({
      where: { id: In(ids) },
      select: ["id", "name", "username"],
    });

    return { status: true, admins };
  } catch (err) {
    return { status: false, errors: err };
  }
};

export const saveChanges = async (data: any) => {
  try {
    const { changes, id } = data;

    const teamRepository = getRepository(Team);

    await teamRepository
      .createQueryBuilder()
      .update()
      .set(changes)
      .where({ id: id })
      .execute();

    return { status: true };
  } catch (err) {
    return { status: false, errors: err };
  }
};
