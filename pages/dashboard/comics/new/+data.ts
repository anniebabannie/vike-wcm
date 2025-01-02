import { PageContextServer } from "vike/types";

export type ReturnedData = {
  userId: string
}
const data = async (pageContext: PageContextServer) => {
  console.log(pageContext.user)
  return {
    userId: pageContext.user.userId
  }
}

export default data;