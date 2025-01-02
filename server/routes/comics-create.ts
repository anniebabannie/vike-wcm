import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

export default async function comicsCreate(req: Request, res: Response, prisma: PrismaClient) {
  const { name, desc, slug, userId } = req.body;
  console.log(req.body);
  if (!name || !desc || !slug || !userId) {
    return res.status(400).json({ message: 'Missing name, description, or slug' });
  }

  try {
    const comic = await prisma.comic.create({
      data: {
        name,
        desc,
        slug,
        userId,
      },
    });
    res.json({ comic }).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}