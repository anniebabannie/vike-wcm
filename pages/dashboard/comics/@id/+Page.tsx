import TopNav from "../../../../renderer/components/TopNav";
import { useData } from "../../../../renderer/useData";
import { usePageContext } from "../../../../renderer/usePageContext";
import { ReturnedData } from "./+data";

const ComicPage = () => {
  const {comic} = useData<ReturnedData>();
  const pageContext = usePageContext()

  return(
    <>
      <TopNav currentPath={pageContext.urlParsed.pathname} />
      <div className="max-w-4xl container mx-auto py-12">
        <h1>{comic.name}</h1>
        <p>{comic.desc}</p>
        <a
          href={`/dashboard/comics/${comic.id}/chapters/new`}
          className="mt-4 inline-block px-4 py-2 rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-600"
        >
          + Add a chapter
        </a>
      </div>
    </>
  )
}

export default ComicPage;