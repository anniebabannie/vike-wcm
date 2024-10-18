import { PrismaClient } from "@prisma/client";
import { PageContextServer } from "vike/types"
import type { Comic, Chapter, Page, Prisma } from "@prisma/client";
import { redirect } from "vike/abort";

const data = async (pageContext: PageContextServer) => {
  return getChapterPages({
    pageNo: parseInt(pageContext.routeParams.pageNo),
    currentChapterSlug: pageContext.routeParams.slug
  });
}

export async function getChapterPages({pageNo, currentChapterSlug}:{pageNo:number | null, currentChapterSlug: string | null}) {
  const prisma = new PrismaClient()
  
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
  
  if (!comic) return { notFound: true }
  
  if (currentChapterSlug === null) {
    const currentChapter = comic.chapters[0];
    if (!currentChapter) return { notFound: true };
    currentChapterSlug = currentChapter.slug;
    const firstPage = currentChapter.pages[currentChapter.pages.length - 1];
    throw redirect(`/${currentChapter.slug}/${firstPage.pageNo}`);
  }

  if (pageNo === null) {
    const currentChapter = comic.chapters.find((chapter) => chapter.slug === currentChapterSlug);
    if (!currentChapter || currentChapter.pages.length === 0) return { notFound: true };
    pageNo = currentChapter.pages[0].pageNo;
  }
  const pagesShown = 1;
  const startIndex = (pageNo - 1) * pagesShown;
  const endIndex = pageNo * pagesShown;
  const pages = comic?.chapters[0].pages;
  if (!pages) return { notFound: true }
  const paginatedPages = pages.slice(startIndex, endIndex);
  const totalPagePages = Math.ceil(pages.length / pagesShown);
  const currentChapter = comic.chapters.filter((chapter) => chapter.slug === currentChapterSlug)[0];
  const currentPage = currentChapter.pages.filter((page) => page.pageNo === pageNo)[0];
  
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