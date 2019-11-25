import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
import logo from './tortoise_white.png';
import Button from '@material-ui/core/Button';

class NavBar extends Component {
  render() {
    return (
      <header>
        {/* <ul id="headerButtons">
          <li className="navButton"><Link to="">Home</Link></li>
          <li className="navButton"><Link to="">Help</Link></li>
        </ul> */}
        <Button variant="contiained" color="disabled">
          <img src={logo} width={500} height={100} mode='fit'/>
        </Button>
      </header>
    )
  }
}

export default NavBar;