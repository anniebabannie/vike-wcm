import { reload } from 'vike/client/router'
import { Chapter, Comic, Page as PrismaPage } from '@prisma/client';
import { useData } from '../../../renderer/useData';
import ReactPaginate from 'react-paginate';
import { useState } from 'react';

export { Page }

type ExtendedComic = Comic & {
  chapters: (Chapter & {
    pages: PrismaPage[];
  })[];
};

function Page() {
  const { comic, currentChapter, currentPage, pages } = useData<{ comic: ExtendedComic, currentChapter: Chapter, currentPage: PrismaPage, pages: PrismaPage[]}>();
  console.log(currentPage)
  return (
    <>
      <aside className="col-span-4 flex flex-col">
        <header className="mb-12">
          <h1 className="text-3xl font-bold">{comic.name}</h1>
          <h2 className="italic text-xl">{comic.desc}</h2>
          <button className="text-blue-600 py-3" onClick={async () => {
            await fetch('/auth/logout', { method: 'POST' })
            await reload()
          }}>Logout</button>
        </header>
        
        <ul className="flex flex-col gap-0.5">
          {comic.chapters.map((chapter, index) => (
            <li key={index} className={`${(chapter.slug == currentChapter.slug) ? 'font-bold' : ''} hover:bg-gray-100 py-2 px-3 -ml-3 rounded-sm`}>
              {chapter.slug === currentChapter .slug&&
                <p>{chapter.title}</p>
              }
              {chapter.slug !== currentChapter.slug &&
                <a href={`/${chapter.slug}`}>{chapter.title}</a>
              }
            </li>
          ))}
        </ul>
      </aside>
      <main className="col-span-8">
        <ChapterPagination totalPages={pages.length} currentPage={currentPage} currentChapter={currentChapter} />
      </main>
    </>
  )
}

export function ChapterPagination({ totalPages, currentPage, currentChapter }: { totalPages: number, currentPage: PrismaPage, currentChapter: Chapter }) {

  return (
    <div className="pagination">

      <a href={`/${currentChapter.slug}/${currentPage.pageNo - 1}`}>Previous</a>
      <a href={`/${currentChapter.slug}/${currentPage.pageNo + 1}`}>Next</a>
      
      <a href={`/${currentChapter.slug}/${currentPage.pageNo + 1}`}>
        <img src={`${currentPage.img}`} alt="" />
      </a>

    </div>
  );
}