import Layout from '../components/Layout'
import { AnimatePresence } from 'framer-motion'

function MyApp({ Component, pageProps, router }) {
  return (
    <Layout>
      <AnimatePresence exitBeforeEnter onExitComplete={() => {
        $("html, body").animate({ scrollTop: 0 })
      }}>
        <Component key={router.route} {...pageProps} />
      </AnimatePresence>
    </Layout>
  )
}

export default MyApp
