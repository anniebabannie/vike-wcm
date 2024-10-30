// https://vike.dev/data
export { data }
export type Data = Awaited<ReturnType<typeof data>>

// The node-fetch package (which only works on the server-side) can be used since
// this file always runs on the server-side, see https://vike.dev/data#server-side
import type { PageContextServer } from 'vike/types'
import { Chapter, Comic, Page, PrismaClient } from '@prisma/client'

export type ReturnedData = {
  initialChapters: Chapter[],
  initialPages: Page[],
  currentChapter: Chapter,
  comic: Comic
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const data = async (pageContext: PageContextServer) => {
  const prisma = new PrismaClient()
  
  const currentChapter = await prisma.chapter.findUnique({ where: {slug: pageContext.routeParams.slug }});
  if (!currentChapter) return { notFound: true }

  const chapters = await prisma.chapter.findMany({
    orderBy: {
      title: 'asc'
    }
  });
  const pages = await prisma.page.findMany({
    where: {
      chapterId: currentChapter.id
    },
    orderBy: {
      pageNo: 'desc'
    }
  });

  const comic = await prisma.comic.findUnique({
    where: { id: '24560ec1-b3e1-4932-b35b-d8c18666034c' },
  });
  if (!comic) return { notFound: true }

  const data: ReturnedData = {
    initialChapters: chapters,
    initialPages: pages,
    currentChapter,
    comic
  }
  return data;
}