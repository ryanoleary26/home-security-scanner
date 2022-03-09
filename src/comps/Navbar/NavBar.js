import React from 'react';

// Style
import './NavBar.css';
import '../../global.css';

// Components
import { NavLink } from 'react-router-dom';
import Stack from '@mui/material/Stack';

export default function NavBar() {
  return (
    <div className="navbar">
      <Stack className="nav" direction={{ xs: 'column', sm: 'row' }} spacing={1}>
        <NavLink className="navitem" to="/">
          Home
        </NavLink>
        <NavLink className="navitem" to="/newscan">
          New Scan
        </NavLink>
        <NavLink className="navitem" to="/schedules">
          Scan Schedules
        </NavLink>
        <NavLink className="navitem" to="/results">
          Scan Results
        </NavLink>
      </Stack>
    </div>
  );
}
