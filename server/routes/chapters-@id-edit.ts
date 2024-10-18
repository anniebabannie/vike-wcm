import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

export default async function chaptersIdEdit(req: Request, res: Response, prisma: PrismaClient) {
  const { id } = req.params;
  const chapter = await prisma.chapter.update({
    where: { id: parseInt(id) },
    data: { title: 'edited title' }
  })
  const editedId = chapter.id
  res.json({ editedId }).status(200)
}