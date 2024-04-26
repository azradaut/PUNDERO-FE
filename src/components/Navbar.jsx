import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  

  return (
    <div className='navbar'>
      <div className='container'>
        <div className='logo'>
          <Link to='/'>
            Home
          </Link>
        </div>
        <div className='links'>
          
          
          <span className='accounts'>
            <Link className='link' to='/accounts'>
            Accounts
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;