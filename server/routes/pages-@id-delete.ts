import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

export default async function pagesIdDelete(req: Request, res: Response, prisma: PrismaClient) {
  const { id } = req.params;
  try {
    const page = await prisma.page.delete({
      where: { id: parseInt(id) }
    })
    res.json({ deletedId: page.id }).status(200)
  } catch (error) {
    res.json({ error }).status(400)
  }
}