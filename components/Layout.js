import { useEffect, useState } from 'react'
import Meta from './Meta'
import Header from './Header'
import Footer from './Footer'
import styles from '../styles/Layout.module.css';
import Statcounter from '../services/Statcounter';

const Layout = ({ children }) => {
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState("fadeOut");

  useEffect(() => {
    setTransitionStage("fadeIn")
    Statcounter();
  }, []);

  useEffect(() => {
    if (children.type.name !== displayChildren.type.name) {
      setTransitionStage("fadeOut");
      Statcounter();
    }
  }, [children, setDisplayChildren, displayChildren]);

  return (
    <>
    <Meta />
    <Header />
    <main
      onTransitionEnd={() => {
        if (transitionStage === "fadeOut") {
          setDisplayChildren(children);
          setTransitionStage("fadeIn");
        }
      }}
      className={`${styles["main-content"]} ${styles[transitionStage]}`}
    >
      {displayChildren}
    </main>
    <Footer />
    </>
  )
}

export default Layout
