import Layout from '../components/Layout'
import { AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

function MyApp({ Component, pageProps, router }) {

  const [ session, inSession ] = useState(false);
  const scrollToTop = () => { $("html, body").animate({ scrollTop: 0 }) };

  const authCheck = async () => {
    if (session) return;
    const res = await fetch(`${location.origin}/api/logged-in`, { method: "post" });
    const loggedIn = await res.json();
    loggedIn && inSession(true);
  }

  useEffect(() => { authCheck() }, []);

  useEffect(() => {
    const socket = io();
    return function cleanup() { socket.disconnect() }
  });

  return (
    <Layout inSession={inSession} session={session}>
      <AnimatePresence exitBeforeEnter onExitComplete={scrollToTop}>
        <Component key={router.route} inSession={inSession} {...pageProps} />
      </AnimatePresence>
    </Layout>
  )
}

export default MyApp
