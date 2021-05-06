import { v4 as uuidv4 } from "uuid";
import { Chatroom } from "../entities/chatroomEntity";
import { getRepository } from "typeorm";

export const CreateChatRoom = async ({ newChatRoom }: any) => {
  try {
    const chatRepository = getRepository(Chatroom);

    const id = uuidv4();

    const newRoom: Chatroom = {
      id,
      name: newChatRoom.name,
      teamID: newChatRoom.teamID,
      members: newChatRoom.members,
      admins: newChatRoom.admins,
      messages: null,
      image: null,
    };

    await chatRepository.insert(newRoom);

    return { status: true, id };
  } catch (err) {
    return { status: false, errors: err };
  }
};

export const fetchChatRooms = async (id: string) => {
  try {
    const chatRepository = getRepository(Chatroom);

    const rooms = await chatRepository
      .createQueryBuilder()
      .select()
      .where("Chatroom.teamID @> ARRAY[:id]", { id })
      .getMany();

    return { status: true, rooms };
  } catch (err) {
    console.log(err);
    return { status: false, errors: err };
  }
};
