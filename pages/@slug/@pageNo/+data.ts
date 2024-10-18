import { PrismaClient } from "@prisma/client";
import { PageContextServer } from "vike/types"
import type { Comic, Chapter, Page, Prisma } from "@prisma/client";

const data = async (pageContext: PageContextServer) => {
  const prisma = new PrismaClient()
  const pageNo = parseInt(pageContext.routeParams.pageNo);
  const pagesShown = 1;
  const startIndex = (pageNo - 1) * pagesShown;
  const endIndex = pageNo * pagesShown;
  
  const comic = await prisma.comic.findUnique({
    where: { id: '24560ec1-b3e1-4932-b35b-d8c18666034c' },
    include: {
      chapters: {
        orderBy: {
          title: 'asc'
        },
        include: {
          pages: {
            orderBy: {
              pageNo: 'desc'
            }
          }
        }
      }
    }
  });
  const pages = comic?.chapters[0].pages;
  if (!pages) return { notFound: true }
  const paginatedPages = pages.slice(startIndex, endIndex);
  const totalPagePages = Math.ceil(pages.length / pagesShown);
  const currentChapter = comic.chapters.filter((chapter) => chapter.slug === pageContext.routeParams.slug)[0];
  console.log("currentChapter", currentChapter)
  const currentPage = currentChapter.pages.filter((page) => page.pageNo === pageNo)[0];
  console.log("currentPage", currentPage)
  
  return { 
    comic, 
    currentChapter,
    currentPage,
    paginatedPages,
    totalPagePages,
    pages
  };
}

export { data }