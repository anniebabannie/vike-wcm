// https://vike.dev/data
export { data }
export type Data = Awaited<ReturnType<typeof data>>

// The node-fetch package (which only works on the server-side) can be used since
// this file always runs on the server-side, see https://vike.dev/data#server-side
import type { PageContextServer } from 'vike/types'
import { Chapter, Page, PrismaClient } from '@prisma/client'

export type ReturnedData = {
  initialChapters: Chapter[],
  initialPages: Page[],
  currentChapter: Chapter,
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
  const data: ReturnedData = {
    initialChapters: chapters,
    initialPages: pages,
    currentChapter
  }
  return data;
}