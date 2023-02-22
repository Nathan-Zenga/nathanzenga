const Footer = () => {
  return (
    <footer id="footer">
      <div className="socials container">
        <a className="fab fa-instagram" target="_blank" aria-hidden="true" href="http://instagram.com/nathanzenga" />
        <a className="fab fa-linkedin" target="_blank" aria-hidden="true" href="https://uk.linkedin.com/in/nathan-zengamambu" />
        <a className="fal fa-envelope" target="_blank" aria-hidden="true" href="mailto:nathanzenga@gmail.com" />
      </div>
      <span className="sr-only">&copy; Nathan Zengamambu {new Date().getFullYear()}. All rights reserved.</span>
    </footer>
  );
}

export default Footer;
