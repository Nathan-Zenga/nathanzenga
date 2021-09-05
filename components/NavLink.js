import Link from 'next/link';

const NavLink = ({ href, text }) => {
  return (
    <Link href={href} scroll={false}><a className="container">{text}</a></Link>
  )
}

NavLink.defaultProps = { href: "/" }

export default NavLink
