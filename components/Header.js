import { useRouter } from 'next/router';
import Link from 'next/link';
import Nav from './Nav';

const Header = ({ inSession, session }) => {

  const router = useRouter();

  const logout = e => {
    e.preventDefault();
    $.post("/api/logout", null, redirectURL => {
      inSession(false);
      router.push(redirectURL, null, { scroll: false });
    }).fail(err => {
      alert(err.responseText);
    })
  };

  return (
    <header id="header">
      <div className="container">
        <div className="row">
          <div className="col-2 col-sm-1" id="nav-container">
            <button className="hamburger hamburger--spin" id="menu-icon" type="button">
              <span className="hamburger-box">
                <span className="hamburger-inner">
                  <span className="sr-only">Menu</span>
                </span>
              </span>
            </button>
            <Nav />
          </div>
          <div className="col" id="logo-container">
            <Link href="/" scroll={false} id="logo">
              <img src="/img/logo-2.png" alt="Logo" />
            </Link>
          </div>
          {
            session &&
            <div className="col-3 col-sm-2" id="logout-link-container">
              <a id="logout-link" href="/logout" onClick={logout}>LOGOUT</a>
            </div>
          }
        </div>
      </div>
    </header>
  );
}

export default Header;
