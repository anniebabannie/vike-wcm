import { PrismaClient } from "@prisma/client";
import { PageContextServer } from "vike/types"
import type { Comic, Chapter, Page, Prisma } from "@prisma/client";
import { getChapterPages } from "../@slug/@pageNo/+data";

const data = async (pageContext: PageContextServer) => {
  const prisma = new PrismaClient()
  return getChapterPages({ pageNo: null, currentChapterSlug: null})

  // const comic = await prisma.comic.findUnique({
  //   where: { id: '24560ec1-b3e1-4932-b35b-d8c18666034c' },
  //   include: {
  //     chapters: {
  //       orderBy: {
  //         title: 'asc'
  //       },
  //       include: {
  //         pages: {
  //           orderBy: {
  //             pageNo: 'desc'
  //           }
  //         }
  //       }
  //     }
  //   }
  // });

  // return { 
  //   comic, 
  //   currentChapter: comic?.chapters[0],
  //   currentPage: comic?.chapters[0].pages[0],
  // };
}

export { data }