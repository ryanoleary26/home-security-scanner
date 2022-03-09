import React from 'react';

// Style
import './Header.css';
import '../../global.css';

// Components
import NavBar from '../Navbar/NavBar';

export default function Header() {
  return (
    <>
      <section className="header">
        <h1>Home Security Scanner</h1>
        <h3>Scanning your home network for vulnerable devices</h3>
      </section>
      <NavBar />
    </>
  );
}
