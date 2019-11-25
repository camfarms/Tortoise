import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
import logo from './tortoise_white.png';

class NavBar extends Component {
  render() {
    return (
      <header>
        <img src={logo} width={500} height={100} mode='fit'/>
      </header>
    )
  }
}

export default NavBar;