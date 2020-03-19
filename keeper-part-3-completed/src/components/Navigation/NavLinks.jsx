import React from 'react';
import { NavLink } from 'react-router-dom';

import './NavLinks.css';
const NavLinks = () => {
  return(
    <ul className="nav-links">
      <li>
        <NavLink to="/notes" exact>
          Notes
        </NavLink>
      </li>
      <li>
        <NavLink to="/auth" exact>
          Authenticate
        </NavLink>
      </li>
    </ul>
  );
};

export default NavLinks;