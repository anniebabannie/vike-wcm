import { Page, PrismaClient } from "@prisma/client";
import multer from "multer";
import express from 'express'
type Express = ReturnType<typeof express>
import pagesIdDelete from "./routes/pages-@id-delete.js";
import authLogin from "./routes/auth-login.js";
import pagesNew from "./routes/pages-new.js";
import chaptersIdEdit from "./routes/chapters-@id-edit.js";
import chaptersIdDelete from "./routes/chapters-@id-delete.js";
import authLogout from "./routes/auth-logout.js";
import comicsCreate from "./routes/comics-create.js";
import chaptersNew from "./routes/chapters-new.js";

function setAuthRoutes(app: Express, root: string, prisma: PrismaClient) {
  app.post('/auth/login', async (req, res) => {
    authLogin(req, res, prisma);
  });
}

export default function setRoutes(app: Express, root: string) {
  // Prisma client (for database)
  const prisma = new PrismaClient()
  
  const upload = multer({ 
    storage: multer.memoryStorage() // Using memory storage instead of disk storage
  });

  app.post('/auth/logout', async (req, res) => {
    authLogout(req, res);
  })

  app.post('/auth/login', async (req, res) => {
    authLogin(req, res, prisma);
  });

  app.post('/comics/create', async (req, res) => {
    comicsCreate(req, res, prisma);
  })

  app.post('/comics/chapters/new', upload.array('pages'), async (req, res) => {
    chaptersNew(req, res, prisma);
  })
  
  app.delete('/admin/chapters/:id/delete', async(req, res) => {
    chaptersIdDelete(req, res, prisma);
  })

  app.put('/admin/chapters/:id/edit', async(req, res) => {
    chaptersIdEdit(req, res, prisma);
  })
  
  app.post('/admin/pages/new', upload.single('file'), async(req, res) => {
    pagesNew(req, res, prisma);
  })

  app.delete('/admin/pages/:id/delete', async(req, res) => {
    pagesIdDelete(req as typeof req, res, prisma);
  })
}