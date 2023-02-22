import Link from 'next/link';

const NavLink = ({ href, text }) => <Link href={href} scroll={false}>{text}</Link>

const Nav = () => {
  return (
    <nav id="nav">
      <div className="container">
        <NavLink href="/" text="Overview" />
        <NavLink href="/photography" text="Photography" />
        <NavLink href="/artwork" text="Artwork" />
        <NavLink href="/designs" text="Designs" />
        <NavLink href="/info" text="Info" />
      </div>
    </nav>
  )
}

export default Nav
