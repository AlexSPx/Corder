import { Projects } from "../entities/ProjectEntity";
import { getRepository, In } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { User } from "../entities/userEntity";

export const createProject = async (data: any): Promise<any> => {
  try {
    const { name, teamid, dates, members, admins, desc } = data;

    const projectRepository = getRepository(Projects);

    const newProject = {
      id: uuidv4(),
      name,
      desc,
      teamID: [teamid],
      status: true,
      range: [dates],
      members: [members],
      admins: [admins],
    };

    await projectRepository
      .createQueryBuilder()
      .insert()
      .values(newProject)
      .execute();

    return { status: true, project: newProject };
  } catch (err) {
    return { status: false, errors: err };
  }
};

export const fetchTeamProjects = async (data: any): Promise<any> => {
  try {
    const { teamid } = data;

    const projectRepository = getRepository(Projects);

    const projects = await projectRepository.find({
      where: { teamID: [teamid] },
    });

    return { status: true, projects };
  } catch (err) {
    return { status: false, errors: err };
  }
};

export const fetchProjectMembers = async (id: any): Promise<any> => {
  try {
    const projectRepository = getRepository(Projects);
    const userRepository = getRepository(User);

    const prj = await projectRepository.findOne(id);

    let mmbrs: any;
    prj?.members.forEach((mmbr) => (mmbrs = mmbr));

    const members = await userRepository.find({
      where: { id: In(mmbrs) },
    });

    return { status: true, members };
  } catch (err) {
    return { status: false, errors: err };
  }
};

export const fetchProject = async (id: any) => {
  try {
    const projectRepository = getRepository(Projects);
    const project = await projectRepository.findOne({ where: { id } });

    return { status: true, project };
  } catch (err) {
    return { status: false, errors: err };
  }
};

export const fetchProjectByMember = async (data: any) => {
  try {
    const projectRepository = getRepository(Projects);

    const projects = await projectRepository
      .createQueryBuilder()
      .where("members @> ARRAY[:members]", { members: data.user.id })
      .getMany();

    return { status: true, projects };
  } catch (err) {
    return { status: false, errors: err };
  }
};
