import { Page, PrismaClient } from "@prisma/client";
import multer from "multer";
import express from 'express'
type Express = ReturnType<typeof express>
import pagesIdDelete from "./routes/pages-@id-delete.js";
import authLogin from "./routes/auth-login.js";
import pagesNew from "./routes/pages-new.js";
import chaptersIdEdit from "./routes/chapters-@id-edit.js";
import chaptersIdDelete from "./routes/chapters-@id-delete.js";
import chaptersNew from "./routes/chapters-new.js";
import authLogout from "./routes/auth-logout.js";

function setAuthRoutes(app: Express, root: string, prisma: PrismaClient) {
  app.post('/auth/login', async (req, res) => {
    authLogin(req, res, prisma);
  });
}

export default function setRoutes(app: Express, root: string) {
  // Prisma client (for database)
  const prisma = new PrismaClient()
  const upload = multer({ dest: `${root}/uploads/` })

  app.post('/auth/logout', async (req, res) => {
    console.log('logouttttttttt')
    authLogout(req, res);
  })

  app.post('/auth/login', async (req, res) => {
    authLogin(req, res, prisma);
  });

  app.post('/chapters/new', async(req, res) => {
    chaptersNew(req, res, prisma);
  })
  
  app.delete('/chapters/:id/delete', async(req, res) => {
    chaptersIdDelete(req, res, prisma);
  })

  app.put('/chapters/:id/edit', async(req, res) => {
    chaptersIdEdit(req, res, prisma);
  })
  
  app.post('/pages/new', upload.single('file'), async(req, res) => {
    pagesNew(req, res, prisma);
  })

  app.delete('/pages/:id/delete', async(req, res) => {
    pagesIdDelete(req as typeof req, res, prisma);
  })
}