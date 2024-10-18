import { reload } from 'vike/client/router'
import { Counter } from './Counter'
export { Page }

function Page() {
  async function logout() {
    await fetch('/auth/logout', { method: 'POST' })
    await reload()
  }
  return (
    <>
      <h1>Welcome</h1>
      This page is:
      <ul>
        <button onClick={logout}>Logout</button>
        <li>Rendered to HTML.</li>
        <li>
          Interactive. <Counter />
        </li>
      </ul>
    </>
  )
}
