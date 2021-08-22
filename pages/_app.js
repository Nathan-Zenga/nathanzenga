import Layout from '../components/Layout'
import '/styles/hamburgers.min.css'
import '/styles/defaults.css'
import '/styles/main.css'

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
