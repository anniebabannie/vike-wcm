// This file isn't processed by Vite, see https://github.com/vikejs/vike/issues/562
// Consequently:
//  - When changing this file, you needed to manually restart your server for your changes to take effect.
//  - To use your environment variables defined in your .env files, you need to install dotenv, see https://vike.dev/env
//  - To use your path aliases defined in your vite.config.js, you need to tell Node.js about them, see https://vike.dev/path-aliases

// If you want Vite to process your server code then use one of these:
//  - vavite (https://github.com/cyco130/vavite)
//     - See vavite + Vike examples at https://github.com/cyco130/vavite/tree/main/examples
//  - vite-node (https://github.com/antfu/vite-node)
//  - HatTip (https://github.com/hattipjs/hattip)
//    - You can use Bati (https://batijs.dev/) to scaffold a Vike + HatTip app. Note that Bati generates apps that use the V1 design (https://vike.dev/migration/v1-design) and Vike packages (https://vike.dev/vike-packages)

import express from 'express'
import compression from 'compression'
import { renderPage } from 'vike/server'
import { root } from './root.js'
import { PrismaClient } from '@prisma/client'
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { readFile, readFileSync } from 'fs'
const isProduction = process.env.NODE_ENV === 'production'

startServer()

async function startServer() {
  const app = express();
  app.use(express.json());
  const upload = multer({ dest: `${root}/uploads/` })
  // Prisma client (for database)
  const prisma = new PrismaClient()

  app.use(compression())

  // Vite integration
  if (isProduction) {
    // In production, we need to serve our static assets ourselves.
    // (In dev, Vite's middleware serves our static assets.)
    const sirv = (await import('sirv')).default
    app.use(sirv(`${root}/dist/client`))
  } else {
    // We instantiate Vite's development server and integrate its middleware to our server.
    // ⚠️ We instantiate it only in development. (It isn't needed in production and it
    // would unnecessarily bloat our production server.)
    const vite = await import('vite')
    const viteDevMiddleware = (
      await vite.createServer({
        root,
        server: { middlewareMode: true }
      })
    ).middlewares
    app.use(viteDevMiddleware)
  }

  // ...
  // Other middlewares (e.g. some RPC middleware such as Telefunc)
  // ...

  // Vike middleware. It should always be our last middleware (because it's a
  // catch-all middleware superseding any middleware placed after it).
  app.get('*', async (req, res) => {
    const pageContextInit = {
      urlOriginal: req.originalUrl,
      headersOriginal: req.headers
    }
    const pageContext = await renderPage(pageContextInit)
    if (pageContext.errorWhileRendering) {
      // Install error tracking here, see https://vike.dev/error-tracking
    }
    const { httpResponse } = pageContext
    if (res.writeEarlyHints) res.writeEarlyHints({ link: httpResponse.earlyHints.map((e) => e.earlyHintLink) })
    httpResponse.headers.forEach(([name, value]) => res.setHeader(name, value))
    res.status(httpResponse.statusCode)
    // For HTTP streams use pageContext.httpResponse.pipe() instead, see https://vike.dev/streaming
    res.send(httpResponse.body)
  })

  // -------------------- ROUTES

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
    if (!req.file) {
      res.json({ message: 'no image provided' }).status(400)
    } else {
      const imagePath = req.file.path;
      const file = readFileSync(imagePath);
      if (!file) {
        res.json({ message: 'no image found in uploads' }).status(400)
      }
      uploadImage(file, req.file.mimetype)
        .then((filename) => {
          res.json({ message: 'ok' }).status(200)
        })
        .catch((err) => {
          res.json({ message: 'error uploading image' }).status(400)
        })
      
    }
  })

  const port = process.env.PORT || 3000
  app.listen(port)
  console.log(`Server running at http://localhost:${port}`)
}


export async function uploadImage(buffer: Buffer, mimetype: string) {
  const ext = getExtension(mimetype)
  const filename = uuidv4();
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
    Key: filename + ext,
    Body: buffer,
    ContentType: "image/jpeg",
  };

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    return filename;
  } catch (error) {
    console.error(error);
    return false;
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
      return 'webp'
    default:
      return '.jpg'
  }
}