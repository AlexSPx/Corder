import { Files } from "../entities/fileEntity";
import { getRepository } from "typeorm";

const mammoth = require("mammoth");

export const extract = (file: any) => {
  mammoth.convertToHtml({ buffer: file }).then((res: any) => {
    return res.value;
  });
};

export const saveDocs = async ({ id, file }: { id: string; file: any }) => {
  try {
    const filesRepository = getRepository(Files);

    await filesRepository
      .createQueryBuilder()
      .update()
      .set({ file: file })
      .where("id = :id", { id })
      .execute();
  } catch (error) {
    console.log(error);
  }
};
