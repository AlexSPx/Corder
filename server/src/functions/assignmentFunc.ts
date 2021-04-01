import { v4 as uuidv4 } from "uuid";
import { getRepository } from "typeorm";
import { Assignment } from "../entities/assignmentEntity";

export const createAssignment = async (data: any) => {
  try {
    const {
      teamID,
      projectID,
      name,
      range,
      members,
      admins,
      desc,
      status,
    } = data;

    const newAssignment = {
      id: uuidv4(),
      teamID,
      projectID,
      name,
      range,
      members,
      admins: [admins],
      description: desc,
      status,
      files: null,
    };

    const assignmentRepository = getRepository(Assignment);
    await assignmentRepository.save(newAssignment);

    return true;
  } catch (err) {
    return false;
  }
};

export const fetchAssignments = async (id: any) => {
  try {
    const assignmentRepository = getRepository(Assignment);

    const assignments = await assignmentRepository.find({
      where: { projectID: id },
    });
    return { status: true, assignments };
  } catch (err) {
    return { status: false, errors: err };
  }
};

export const fetchOneAssignment = async (id: any) => {
  try {
    const assignmentRepository = getRepository(Assignment);

    const assignment = await assignmentRepository.find({
      where: { id },
    });

    return { status: true, assignment };
  } catch (err) {
    return { status: false, errors: err };
  }
};

export const fetchUserAssignments = async (id: any) => {
  try {
    const assignmentRepository = getRepository(Assignment);

    const assignments = await assignmentRepository
      .createQueryBuilder()
      .where("members @> ARRAY[:members]", { members: id })
      .getMany();

    return { status: true, assignments };
  } catch (err) {
    return { status: false, errors: err };
  }
};
