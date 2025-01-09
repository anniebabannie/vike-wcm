import { reload } from "vike/client/router";
import { usePageContext } from "../../renderer/usePageContext";
import { ReturnedData } from "./+data";
import { useData } from "../../renderer/useData";
import TopNav from "../../renderer/components/TopNav";

const DashboardPage = () => {
  const pageContext = usePageContext()
  const {comics} = useData<ReturnedData>();

  return (
    <>
      <TopNav currentPath={pageContext.urlParsed.pathname} />

      <div className="max-w-4xl container mx-auto py-12">
        {comics.length === 0 && (
          <div className="p-4 text-center">You don't have any comics yet. <a href="/dashboard/comics/new" className="text-blue-500">Create one</a></div>
        )}
        {comics.length > 0 && (
          <div className="flex space-x-4">
            {comics.map((comic) => (
              <a
                key={comic.id}
                href={`/dashboard/comics/${comic.id}`}
                className="px-3 py-2 rounded-md text-sm font-medium bg-gray-200 hover:bg-gray-300"
              >
                {comic.name}
              </a>
            ))}
            <a
              href="/dashboard/comics/new"
              className="px-3 py-2 rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-600"
            >
              + New Comic
            </a>
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardPage;