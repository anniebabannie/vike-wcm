import { v4 as uuidv4 } from 'uuid';
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Page, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { readFileSync } from "fs";

export default async function pagesNew(req: Request, res: Response, prisma: PrismaClient) {
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
          pageNo: parseInt(req.body.pageNo),
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
}

async function uploadImage(buffer: Buffer, mimetype: string): Promise<string | undefined> {
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