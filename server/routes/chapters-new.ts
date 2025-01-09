import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import fs from 'fs';
import path from 'path';

export default async function chaptersNew(req: Request, res: Response, prisma: PrismaClient) {
    try {
        const { comicId, title } = req.body;
        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            return res.status(400).json({ error: "No images provided" });
        }

        if (!comicId) {
            return res.status(400).json({ error: "Comic ID is required" });
        }

        // Create the chapter in the database
        const chapter = await prisma.chapter.create({
            data: {
                title,
                comicId: comicId,
            }
        });

        // Create directory for this comic's images
        const chapterDir = path.join('uploads', 'comics', comicId.toString(), chapter.id.toString());
        fs.mkdirSync(chapterDir, { recursive: true });

        // Save the images
        const imagePromises = files.map(async (file, index) => {
            const extension = path.extname(file.originalname);
            const filename = `${Date.now()}-${index}${extension}`;
            const filepath = path.join(chapterDir, filename);
            
            await fs.promises.writeFile(filepath, file.buffer);
            return filepath;
        });

        const imagePaths = await Promise.all(imagePromises);


        return res.status(201).json(chapter);

    } catch (error) {
        console.error('Error creating chapter:', error);
        return res.status(500).json({ 
            error: "Failed to create chapter",
            details: error instanceof Error ? error.message : "Unknown error"
        });
    }
}