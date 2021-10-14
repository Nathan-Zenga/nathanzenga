import Layout from '../components/Layout'
import { AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps, router }) {

  const [ session, inSession ] = useState(false);
  const scrollToTop = () => { $("html, body").animate({ scrollTop: 0 }) };

  useEffect(async () => {
    if (session) return;
    const res = await fetch(`${location.origin}/api/logged-in`, { method: "post" });
    const loggedIn = await res.json();
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
