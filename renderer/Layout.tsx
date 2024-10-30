export { Layout }

import React from 'react'
import logoUrl from './logo.svg'
import { PageContextProvider } from './usePageContext'
import { Link } from './Link'
import type { PageContext } from 'vike/types'
import './css/index.css'
import './Layout.css'

function Layout({ children, pageContext }: { children: React.ReactNode; pageContext: PageContext }) {
  return (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
          <div className="max-w-5xl mx-auto grid grid-cols-12 gap-4 py-10">
            {children}
          </div>
      </PageContextProvider>
    </React.StrictMode>
  )
}