import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom'

class Header extends Component {
  render() {
    return (
      <header>
        <div className="container">
          <div className="row">
            <div className="col-6" id="nav-wrapper">
              <button className="hamburger hamburger--spin" id="menu-icon" type="button">
                <span className="hamburger-box">
                  <span className="hamburger-inner"></span>
                </span>
              </button>
              <nav>
                <NavLink className="container" activeClassName="current" exact to="/">Overview</NavLink>
                <NavLink className="container" activeClassName="current" to="/photo">Photography</NavLink>
                <NavLink className="container" activeClassName="current" to="/artwork">Artwork</NavLink>
                <NavLink className="container" activeClassName="current" to="/designs">Designs</NavLink>
                <NavLink className="container" activeClassName="current" to="/info">Info</NavLink>
              </nav>
            </div>
            <div className="col-6" id="logo-wrapper">
              <Link id="logo" to="/"><img src="/img/logo.png" alt="Logo" /></Link>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
