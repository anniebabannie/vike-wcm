import TopNav from "../../../../renderer/components/TopNav"
import Wrapper from "../../../../renderer/components/Wrapper"
import { useForm, SubmitHandler } from "react-hook-form";
import { usePageContext } from "../../../../renderer/usePageContext";
import { ReturnedData } from "./+data";
import { useData } from "../../../../renderer/useData";
import { navigate } from "vike/client/router";

const NewComicPage = () => {
  const { userId } = useData<ReturnedData>();
  type FormValues = {
    name: string;
    desc: string;
    slug: string;
  };

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const validateSlug = (value: string) => {
    return /^[a-zA-Z0-9-]+$/.test(value) || "Slug can only contain letters, numbers, or dashes";
  };
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      await fetch('/comics/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({...data, userId})
      })
      navigate('/dashboard')
    } catch(e) {
      console.error(e);
    }
  };
  return(
    <>
      <TopNav currentPath="/dashboard/comics/new" />
      <Wrapper>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              {...register("name", { required: "Name is required" })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="desc" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="desc"
              {...register("desc", { required: "Description is required" })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.desc && <p className="mt-2 text-sm text-red-600">{errors.desc.message}</p>}
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
              Slug
            </label>
            <div className="flex items-center gap-4">
              <input
                id="slug"
                type="text"
                {...register("slug", { 
                  required: "Slug is required",
                  validate: validateSlug
                })}
                className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <p>.webcomic.studio</p>
            </div>
            {errors.slug && <p className="mt-2 text-sm text-red-600">{errors.slug.message}</p>}
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </div>
        </form>
      </Wrapper>
    </>
  )
}

export default NewComicPage;