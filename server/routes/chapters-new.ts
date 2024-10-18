import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

export default async function chaptersNew(req: Request, res: Response, prisma: PrismaClient) {
  const { title } = req.body;
  if (!title) {
    res.json({ message: `Missing title` })
  } else {
    const chapter = await prisma.chapter.create({
      data: { 
        title,
        slug: slugify(title)
      }
    })
    console.log(chapter)
    res.json({ chapter }).status(200)
  }
}

function slugify(str:string) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim leading/trailing white space
  str = str.toLowerCase(); // convert string to lowercase
  str = str.replace(/[^a-z0-9 -]/g, '') // remove any non-alphanumeric characters
           .replace(/\s+/g, '-') // replace spaces with hyphens
           .replace(/-+/g, '-'); // remove consecutive hyphens
  return str;
}