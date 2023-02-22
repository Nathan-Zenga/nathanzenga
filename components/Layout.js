import Meta from './Meta'
import Header from './Header'
import Footer from './Footer'

const Layout = ({ children, inSession, session }) => {
  return (
    <>
    <Meta />
    <Header inSession={inSession} session={session} />
    <main>
      {children}
    </main>
    <Footer />
    <script src="/js/main.js" />
    </>
  )
}

export default Layout
