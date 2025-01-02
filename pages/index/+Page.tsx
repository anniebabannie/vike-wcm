import { navigate, reload } from 'vike/client/router'
import { useData } from '../../renderer/useData';
import { Chapter, Comic, Page as PrismaPage } from '@prisma/client';
import { ChapterPagination } from '../@slug/@pageNo/+Page';
import { useForm } from 'react-hook-form';

export { Page }

type ExtendedComic = Comic & {
  chapters: (Chapter & {
    pages: PrismaPage[];
  })[];
};

function Page() {
  // const { comic, currentChapter, currentPage, pages } = useData<{ comic: ExtendedComic, currentChapter: Chapter, currentPage: PrismaPage, pages: PrismaPage[]}>();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data: any) => {
    fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(result => {
        console.log('Success:', result);
        // throw navigate('/admin/chapters/chapter-1')
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <>
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-2">Web Comic Studio</h1>
      <p className="text-lg mb-6">A platform for web comics</p>
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 w-full max-w-sm">
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            {...register('email', { required: 'Email is required' })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            defaultValue={""}
            {...register('password', { required: 'Password is required' })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Log In</button>
      </form>
    </div>
    </>
  )
}