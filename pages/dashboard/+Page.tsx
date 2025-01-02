import { reload } from "vike/client/router";
import { usePageContext } from "../../renderer/usePageContext";

const TopNav = () => {
  const pageContext = usePageContext()

  async function logout() {
    // Removes the authentication cookie
    await fetch('/auth/logout', { method: 'POST' })
    // Re-render the page to take into account the removed cookie
    await reload()
    // Reload is finished
  }

  return (
    <nav className="p-4 flex justify-between items-center border-b border-gray-200">
      <div className="text-xl font-bold">Web Comic Studio</div>
      <div className="flex space-x-4">
        <a
          href="/dashboard"
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            pageContext.urlParsed.pathname === '/dashboard' ? 'bg-gray-200 hover:bg-gray-300' : ''
          }`}
        >
          My Comics
        </a>
        <a
          href="/dashboard/account"
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            pageContext.urlParsed.pathname === '/dashboard/account' ? 'bg-gray-200 hover:bg-gray-300' : ''
          }`}
        >
          Account
        </a>
        <button
          // href="/logout"
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            pageContext.urlParsed.pathname === '/logout' ? 'bg-gray-200 hover:bg-gray-300' : ''
          }`}
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default TopNav;