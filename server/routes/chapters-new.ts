import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

export default async function chaptersNew(req: Request, res: Response, prisma: PrismaClient) {
  const { comicId, title } = req.body;
  const files = req.files as Express.Multer.File[];
  
  try {
    // Add a new Chapter to the Comic with this id
    const newChapter = await prisma.chapter.create({
      data: {
        title,
        comicId,
      },
    });
  
    // Upload files to the /data directory
    const uploadPromises = files.map((file) => {
      const filePath = `/data/${file.originalname}`;
      return new Promise<void>((resolve, reject) => {
        fs.writeFile(filePath, file.buffer, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });
  
    await Promise.all(uploadPromises);
  
    res.status(201).json({ message: "Chapter created successfully", chapter: newChapter });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while creating the chapter" });
  }
}