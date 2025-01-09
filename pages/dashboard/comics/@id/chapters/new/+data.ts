import { PageContextServer } from "vike/types";

export type ReturnedData = {
  comicId: string
}

const data = async (pageContext: PageContextServer) => {
  return {
    comicId: pageContext.routeParams.id
  }
}

export default data;