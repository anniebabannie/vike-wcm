import { Comic, PrismaClient } from "@prisma/client"
import { PageContextServer } from "vike/types"

export type ReturnedData = {
  comic: Comic
}

const data = async (pageContext: PageContextServer) => {
  const prisma = new PrismaClient()
  const comicId = pageContext.routeParams.id;
  const comic = await prisma.comic.findUnique({
    where: {
      id: comicId
    }
  });

  return {
    comic
  };
}

export default data;