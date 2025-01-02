import { PrismaClient } from '@prisma/client';
import { redirect, render } from 'vike/abort';
import { PageContextServer } from 'vike/types';

export async function guard(pageContext: PageContextServer) {
  const prisma = new PrismaClient()
  if (!pageContext.user) {
    throw redirect('/')
  }
}