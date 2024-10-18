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
      <aside className="col-span-4">
        <h2>{comic.name}</h2>
        <p>{comic.desc}</p>
        
        <ul>
          {comic.chapters.map((chapter, index) => (
            <li key={index} className={`${(chapter.slug == currentChapter.slug) ? 'font-bold' : ''} hover:bg-gray-100`}>
              {chapter.slug === currentChapter .slug&&
                <p>{chapter.title}</p>
              }
              {chapter.slug !== currentChapter.slug &&
                <a href={`/${chapter.slug}`}>{chapter.title}</a>
              }
            </li>
          ))}
        </ul>
        <button onClick={async () => {
          await fetch('/auth/logout', { method: 'POST' })
          await reload()
        }}>Logout</button>
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