import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form"
import DragAndDrop from "./DragAndDrop";
import BasicLayout from "../GridDnd";
import { Chapter, Page } from "@prisma/client";

type Inputs = {
  file: FileList;
  pageNo: number;
}

const Pages = ({ initialPages, currentChapter }: {
  initialPages: Page[],
  currentChapter: Chapter
}) => {

  const [pages, setPages] = useState(initialPages)
  useEffect(() => {
    setPages(initialPages)
  },[initialPages])

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const file = data.file[0];
    const formData = new FormData();
    formData.append('file', file); // Add the first file from the FileList
    formData.append('pageNo', data.pageNo.toString());
    formData.append('chapterId', currentChapter.id.toString());

    const resp = await fetch('http://localhost:3000/admin/pages/new', { 
        method: 'POST', 
        body: formData,
    })

    const { page } = await resp.json();
    setPages((prevPages) => [...prevPages, page]);
  }

  async function handleDelete(id: number) {
    const resp = await fetch(`http://localhost:3000/admin/pages/${id}/delete`, { 
        method: 'DELETE'
      })
    const { deletedId } = await resp.json()
    setPages((prevPages) => prevPages.filter((page) => page.id !== deletedId))
  }

  return(
    <div>
      {/* <BasicLayout /> */}
      <div className="grid grid-cols-4 gap-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <input type="number" defaultValue={3} {...register("pageNo")} placeholder="Page number..." className="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
          <input type="file" {...register("file")} placeholder="Chapter name..." className="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
          {errors.file && <span>This field is required</span>}
          <button type="submit" className="rounded-md py-1.5 px-4 bg-blue-800 text-white">Add</button>
        </form>
        {pages?.map((page) => (
          <div key={page.id}>
            <p>{page.pageNo}</p>
            <img src={page.img} alt="" />
            <button onClick={() => handleDelete(page.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Pages