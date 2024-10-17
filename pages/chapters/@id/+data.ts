// https://vike.dev/data
export { data }
export type Data = Awaited<ReturnType<typeof data>>

// The node-fetch package (which only works on the server-side) can be used since
// this file always runs on the server-side, see https://vike.dev/data#server-side
import type { PageContextServer } from 'vike/types'
import { PrismaClient } from '@prisma/client'


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const data = async (pageContext: PageContextServer) => {
  const prisma = new PrismaClient()
  const chapters = await prisma.chapter.findMany();
  const pages = await prisma.page.findMany({
    where: {
      chapterId: parseInt(pageContext.routeParams.id)
    }
  });
  return {
    initialChapters: chapters,
    initialPages: pages,
    currentChapter: pageContext.routeParams.id
  }
}