import { PrismaClient } from '@prisma/client';
import { render } from 'vike/abort';
import { PageContextServer } from 'vike/types';

export async function guard(pageContext: PageContextServer) {
  const prisma = new PrismaClient()
  if (!pageContext.user) {
    throw render(401, "You aren't allowed to access this page.")
  }

  const { userId } = pageContext.user;
  const { slug } = pageContext.routeParams;

  try {
    const chapter = await prisma.chapter.findUnique({ where: { slug }, 
      include: {
        comic: true
      }});

    if (!chapter) {
      throw render(404, 'Chapter not found')
    }
    if (!chapter.comic) {
      throw render(404, 'Comic not found')
    }

    console.log(chapter.comic.userId, pageContext.user.userId);
    
    if (chapter.comic.userId !== userId) {
      throw render(401, "You aren't allowed to access this page.")
    }
    // const chapter = await prisma.$queryRaw`
    //   SELECT Chapter.slug
    //   FROM Chapter
    //   JOIN Comic ON Comic.id = Chapter."comicId"
    //   WHERE Chapter.slug = ${slug} AND Comic."userId" = ${user};
    //   `;
    // console.log(chapter);
  } catch (error) {
    console.log(error);
    throw render(404, 'Chapter not found')
  }
}