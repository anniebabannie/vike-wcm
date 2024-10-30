import { navigate, reload } from "vike/client/router"
import { ExtendedComic } from "../types"
import { Comic, User } from "@prisma/client"

export default function ComicHeader({ comic, currentUser }: { comic: Comic | ExtendedComic, currentUser?: User}) {
  return (
    <header className="mb-12">
      <h1 className="text-3xl font-bold">{comic.name}</h1>
      <h2 className="italic text-xl">{comic.desc}</h2>
      {currentUser &&
        <button className="text-blue-600 py-3" onClick={async () => {
          await fetch('/auth/logout', { method: 'POST' })
          navigate("/")
        }}>Logout</button>
      }
    </header>
  )
}