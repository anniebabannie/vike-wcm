import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

export default async function chaptersIdDelete(req: Request, res: Response, prisma: PrismaClient) {
  const { id } = req.params;
  const chapter = await prisma.chapter.delete({
    where: { id: parseInt(id) }
  })

  const deletedId = chapter.id
  res.json({ deletedId }).status(200)
}