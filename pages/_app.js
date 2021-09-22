import Layout from '../components/Layout'
import { AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react';
import axios from 'axios';

function MyApp({ Component, pageProps, router }) {

  const [ session, inSession ] = useState(false);
  const scrollToTop = () => { $("html, body").animate({ scrollTop: 0 }) };

  useEffect(async () => {
    if (session) return;
    const { data: loggedIn } = await axios.get("/api/logged-in");
    loggedIn && inSession(true);
  }, []);

  return (
    <Layout inSession={inSession} session={session}>
      <AnimatePresence exitBeforeEnter onExitComplete={scrollToTop}>
        <Component key={router.route} inSession={inSession} {...pageProps} />
      </AnimatePresence>
    </Layout>
  )
}

export default MyApp
