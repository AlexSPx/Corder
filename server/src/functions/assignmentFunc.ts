import { v4 as uuidv4 } from "uuid";
import { getRepository } from "typeorm";
import { Assignment } from "../entities/assignmentEntity";
import { Team } from "../entities/teamEntity";
import { AssignmentsCollector } from "../entities/assignmentsCollectorEntity";

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

    const newAssignment: Assignment = {
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
      type: "group",
    };

    const assignmentRepository = getRepository(Assignment);
    await assignmentRepository.save(newAssignment);

    return true;
  } catch (err) {
    return false;
  }
};

export const createForeachAssignment = async (data: any) => {
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

    let allIds: string[] = [];
    let allAssignments: Assignment[] = [];

    members.forEach((member: string) => {
      const id = uuidv4();
      allIds.push(id);

      const newAssignment: Assignment = {
        id: id,
        teamID,
        projectID,
        name,
        range,
        members: [member],
        admins: [admins],
        description: desc,
        status,
        files: null,
        type: "foreach",
      };

      allAssignments.push(newAssignment);
    });

    const Collector: AssignmentsCollector = {
      id: uuidv4(),
      projectID,
      teamID,
      name,
      status,
      range,
      admins,
      description: desc,
      assignments: allIds,
    };

    const assignmentRepository = getRepository(Assignment);
    const collectorRepository = getRepository(AssignmentsCollector);

    await assignmentRepository
      .createQueryBuilder()
      .insert()
      .values(allAssignments)
      .execute();
    await collectorRepository
      .createQueryBuilder()
      .insert()
      .values(Collector)
      .execute();

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const fetchAssignments = async (data: any) => {
  try {
    const assignmentRepository = getRepository(Assignment);

    const { projectID, userID } = data;

    if (projectID && userID) {
      const assignments = await assignmentRepository
        .createQueryBuilder()
        .select()
        .where("Assignment.members @> ARRAY[:member]", { member: userID })
        .andWhere("Assignment.projectID = :projectID", { projectID })
        .getMany();
      return { status: true, assignments };
    } else {
      return { status: true };
    }
  } catch (err) {
    return { status: false, errors: err };
  }
};

export const fetchAssignmentsAdmin = async (id: any) => {
  try {
    const assignmentRepository = getRepository(Assignment);
    const collectorRepository = getRepository(AssignmentsCollector);

    const collectors = await collectorRepository
      .createQueryBuilder()
      .select()
      .where("AssignmentsCollector.projectID = :id", { id })
      .getMany();

    const assignments = await assignmentRepository
      .createQueryBuilder()
      .select()
      .where("Assignment.projectID = :id", { id })
      // .andWhere("Assignment.type = :type", { type: "for each" })
      .getMany();

    let data = {
      collectors,
      assignments,
    };

    return { status: true, data };
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

export const fetchAssignmentByName = async (
  team: string,
  assignmentname: string
) => {
  try {
    const assignmentRepository = getRepository(Assignment);
    const teamRepository = getRepository(Team);

    const teamid = await teamRepository.findOne({
      where: { name: team },
      select: ["id"],
    });

    const assignment = await assignmentRepository
      .createQueryBuilder()
      .where("Assignment.teamID @> ARRAY[:teamID]", { teamID: teamid!.id })
      .andWhere("Assignment.name = :name", { name: assignmentname })
      .getOne();

    return { status: true, assignment };
  } catch (err) {
    return { status: false, errors: err };
  }
};

export const statusChange = async () => {
  try {
    const assignmentRepository = getRepository(Assignment);
  } catch (err) {
    return { status: false, errors: err };
  }
};
