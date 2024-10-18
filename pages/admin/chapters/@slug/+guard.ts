import { PrismaClient } from '@prisma/client';
import { redirect, render } from 'vike/abort';
import { PageContextServer } from 'vike/types';

export async function guard(pageContext: PageContextServer) {
  const prisma = new PrismaClient()
  if (!pageContext.user) {
    throw redirect('/login')
  }

  const { userId } = pageContext.user;
  const { slug } = pageContext.routeParams;

  try {
    const chapter = await prisma.chapter.findUnique({ where: { slug }, 
      include: {
        comic: {
          select: {
            userId: true
          }
        }
      }});

    if (!chapter) {
      throw render(404, 'Chapter not found')
    }
    if (!chapter.comic) {
      throw render(404, 'Comic not found')
    }

    console.log(chapter.comic.userId, pageContext.user.userId);
    
    if (chapter.comic.userId !== userId) {
      redirect('/')
    }
  } catch (error) {
    console.log(error);
    throw render(404, 'Chapter not found')
  }
}