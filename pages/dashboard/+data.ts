import { PrismaClient } from "@prisma/client";
import { PageContextServer } from "vike/types"
import type { Comic, Chapter, Page, Prisma } from "@prisma/client";
import { getChapterPages } from "../@slug/@pageNo/+data";


export type ReturnedData = {
  comics: Comic[]
}

const data = async (pageContext: PageContextServer) => {
  const prisma = new PrismaClient()

  const userId = pageContext.user.id;
  const comics = await prisma.comic.findMany({
    where: {
      userId: userId
    }
  });

  return { 
    comics
  };
}

export { data }