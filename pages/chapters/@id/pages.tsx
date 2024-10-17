import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form"

type Inputs = {
  img: Blob;
  page_no: number;
}

const Pages = ({ initialPages }) => {
  const [pages, setPages] = useState(initialPages)
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = async (data) => {

    const resp = await fetch('http://localhost:3000/pages/new', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
      })
    const { page } = await resp.json()
    setPages((prevPages) => [...prevPages, page])
    reset()
  }

  return(
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3">
        <input type="file" {...register("img")} placeholder="Chapter name..." className="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
        {errors.img && <span>This field is required</span>}
        <button type="submit" className="rounded-md py-1.5 px-4 bg-blue-800 text-white">Add</button>
      </form>
    {pages?.map((page) => (
      <>
        <p>{page.page_no}</p>
        <img src={page.img} alt="" />
      </>
    ))}
    </div>
  )
}

export default Pages