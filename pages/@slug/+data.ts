import { PrismaClient } from "@prisma/client";
import { PageContextServer } from "vike/types"
import type { Comic, Chapter, Page, Prisma } from "@prisma/client";
import { redirect } from "vike/abort";

const data = async (pageContext: PageContextServer) => {
  const prisma = new PrismaClient();
  const currentChapter = await prisma.chapter.findUnique({
    where: { slug: pageContext.routeParams.slug },
    include: { pages: {
      orderBy: { pageNo: 'asc'}
    } }
  });
  
  if (currentChapter && currentChapter.pages.length > 0) {
    const firstPage = currentChapter.pages[0];
    console.log(firstPage)
    throw redirect(`/${currentChapter.slug}/${firstPage.pageNo}`);
  }
}

export { data }