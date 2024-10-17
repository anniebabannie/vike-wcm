import { Page, PrismaClient } from "@prisma/client";
import multer from "multer";
import express from 'express'
import { readFileSync } from "fs";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
type Express = ReturnType<typeof express>
import { v4 as uuidv4 } from 'uuid';

export default function setRoutes(app: Express, root: string) {
  const upload = multer({ dest: `${root}/uploads/` })
  // Prisma client (for database)
  const prisma = new PrismaClient()

  app.post('/chapters/new', async(req, res) => {
    const { title } = req.body;
    if (!title) {
      res.json({ message: `Missing title` })
    } else {
      const chapter = await prisma.chapter.create({
        data: { title }
      })
      console.log(chapter)
      res.json({ chapter }).status(200)
    }
  })
  
  app.delete('/chapters/:id/delete', async(req, res) => {
    const { id } = req.params;
    const chapter = await prisma.chapter.delete({
      where: { id: parseInt(id) }
    })
  
    const deletedId = chapter.id
    res.json({ deletedId }).status(200)
  })
  
  app.post('/pages/new', upload.single('file'), async(req, res) => {
    let page: Page | null = null;
    if (!req.file) {
      res.json({ message: 'no image provided' }).status(400)
    } else {
      const imagePath = req.file.path;
      const file = readFileSync(imagePath);
      if (!file) {
        res.json({ message: 'no image found in uploads' }).status(400)
      }

      try {
        const url = await uploadImage(file, req.file.mimetype);
        page = await prisma.page.create({
          data: {
            page_no: parseInt(req.body.page_no),
            img: url as string,
            chapterId: parseInt(req.body.chapterId)
          }
        })
        console.log("made the page")
          console.log(page)
          res.json({ page }).status(200)
        } catch (error) {
        res.json({ error }).status(400)
      }
    }
  })

  app.delete('/pages/:id/delete', async(req, res) => {
    const { id } = req.params;
    try {
      const page = await prisma.page.delete({
        where: { id: parseInt(id) }
      })
      res.json({ deletedId: page.id }).status(200)
    } catch (error) {
      res.json({ error }).status(400)
    }
  })
}

export async function uploadImage(buffer: Buffer, mimetype: string): Promise<string | undefined> {
  const ext = getExtension(mimetype)
  const filename = uuidv4() + ext;
  const {AWS_REGION, BUCKET_NAME, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY} = process.env;
  const s3Client = new S3Client({
    endpoint: "https://fly.storage.tigris.dev",
    region: AWS_REGION!,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID!,
      secretAccessKey: AWS_SECRET_ACCESS_KEY!,
    },
  });

  const params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: buffer,
    ContentType: mimetype,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    return `https://fly.storage.tigris.dev/${BUCKET_NAME}/${filename}`;
  } catch (error) {
    console.error(error);
  }
}

function getExtension(mimetype: string) {
  switch (mimetype) {
    case 'image/jpeg':
      return '.jpg'
    case 'image/png':
      return '.png'
    case 'image/gif':
      return '.gif'
    case 'image/webp':
      return '.webp'
    default:
      return '.jpg'
  }
}