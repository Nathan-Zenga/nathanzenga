import '/styles/Nav.module.css';
import NavLink from './NavLink';

const Nav = () => {
  return (
    <nav id="nav">
      <NavLink text="Overview" />
      <NavLink href="/photography" text="Photography" />
      <NavLink href="/artwork" text="Artwork" />
      <NavLink href="/designs" text="Designs" />
      <NavLink href="/info" text="Info" />
    </nav>
  )
}

export default Nav
