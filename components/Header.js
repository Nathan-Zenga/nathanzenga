import React, { Component } from 'react';
import Link from 'next/link'
import Nav from './Nav';
// import '/styles/Header.module.css';
// import { Link, NavLink } from 'react-router-dom'

class Header extends Component {
  render() {
    return (
      <header id="header">
        <div className="container">
          <div className="row">
            <div className="col-2 col-sm-1" id="nav-wrapper">
              <button className="hamburger hamburger--spin" id="menu-icon" type="button">
                <span className="hamburger-box">
                  <span className="hamburger-inner"></span>
                </span>
              </button>
              <Nav />
            </div>
            <div className="col" id="logo-wrapper">
              <Link href="/"><a id="logo"><img src="/img/logo.png" alt="Logo" /></a></Link>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
