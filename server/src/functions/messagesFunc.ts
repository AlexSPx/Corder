import { Message } from "../entities/messageEntity";
import { v4 as uuidv4 } from "uuid";
import { getRepository } from "typeorm";

let tempMessages: Message[] = [];

export interface IncomingMessageInterface {
  message: string;
  roomid: string;
  userid: string;
}

export const addMessage = (message: IncomingMessageInterface) => {
  const messageid = uuidv4();
  tempMessages.push({
    id: messageid,
    message: message.message,
    type: "text",
    userid: message.userid,
    roomid: message.roomid,
    sentat: Date.now(),
  });

  return { id: messageid };
};

const pushUpdates = async () => {
  try {
    const messageRepository = getRepository(Message);

    await messageRepository
      .createQueryBuilder()
      .insert()
      .values(tempMessages)
      .execute();

    tempMessages = [];
  } catch (err) {
    console.log(err);
  }
};

setInterval(() => pushUpdates(), 5000);

export const getLatestMessages = async ({
  roomid,
  off,
}: {
  roomid: string;
  off: number;
}) => {
  try {
    const messageRepository = getRepository(Message);

    console.log(off);

    if (off === 0) {
      const messages = await messageRepository
        .createQueryBuilder()
        .select()
        .where("Message.roomid = :roomid", { roomid })
        .orderBy("Message.sentat", `DESC`)
        .limit(20)
        .getMany();

      const count = await messageRepository
        .createQueryBuilder()
        .where("Message.roomid = :roomid", { roomid })
        .getCount();

      messages.reverse();

      return { status: true, messages, count };
    }

    const messages = await messageRepository
      .createQueryBuilder()
      .select()
      .where("Message.roomid = :roomid", { roomid })
      .orderBy("Message.sentat", `DESC`)
      .offset(off)
      .limit(20)
      .getMany();

    messages.reverse();

    return { status: true, messages };
  } catch (err) {
    return { status: true, errors: err };
  }
};
