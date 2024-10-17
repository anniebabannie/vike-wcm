export default Page

import { Chapter } from '@prisma/client'
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from 'react'
import { useData } from '../../../renderer/useData';
import Pages from './pages';
import { Link } from '../../../renderer/Link';

type Inputs = {
  title: string;
}

function Page() {
  const {initialChapters, initialPages, currentChapter} = useData();
  const [chapters, setChapters] = useState(initialChapters);
  const [pages, setPages] = useState(initialPages);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = async (data) => {

    const resp = await fetch('http://localhost:3000/chapters/new', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title
        }),
      })
    const { chapter } = await resp.json()
    setChapters((prevChapters) => [...prevChapters, chapter])
    reset()
  }

  async function deleteChapter(id: number) {
    const resp = await fetch(`http://localhost:3000/chapters/${id}/delete`, { 
        method: 'DELETE'
      })
    const { deletedId } = await resp.json()
    setChapters((prevChapters) => prevChapters.filter((chapter) => chapter.id !== deletedId))
  }

  return (
    <div className="grid grid-cols-12 gap-4">
      <aside className="col-span-4">
        <h1>Peach Boy Comic</h1>
        {currentChapter}
        <ul>
          {chapters?.map((chapter) => (
            <li key={chapter.id} className="flex gap-4 justify-between">
              <Link href={`/chapters/${chapter.id}`} className={`${(currentChapter === chapter.id.toString()) ? 'font-bold': ''}`}>{chapter.title}</Link>
              <button onClick={() => deleteChapter(chapter.id)}>Delete</button>
            </li>
          ))}
        </ul>
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3">
          <input type="text" {...register("title")} placeholder="Chapter name..." className="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
          {errors.title && <span>This field is required</span>}
          <button type="submit" className="rounded-md py-1.5 px-4 bg-blue-800 text-white">Add</button>
        </form>
      </aside>
      <main className="col-span-8">
        <h1>Pages</h1>
        <Pages initialPages={initialPages} currentChapter={currentChapter}/>
      </main>
    </div>
  );
};

