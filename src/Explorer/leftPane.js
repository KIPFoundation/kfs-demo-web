import React, { Component } from 'react';
import { Image } from 'semantic-ui-react';
import { Link } from "react-router-dom";
import KIP_LOGO from '../assets/KIP_LOGO.png';
import '../assets/css/leftPane.css';

class LeftPane extends Component {
  render() {
    return (
      <div>
        <Image className="app_logo" src={KIP_LOGO}/>
        <InboxMenu />
      </div>
    );
  }
}

class InboxMenu extends Component {
  render() {
    const route = window.location.pathname;
    return (
      <div className="pane_content">
        <Link className={route === '/home' ? 'activeItem' : 'inactiveItem'}
          to="/home">Home
        </Link>
        <Link className={route === '/sharing' ? 'activeItem' : 'inactiveItem'}
          to="/sharing">Sharing
        </Link>
        {/* <Link className={route === '/aboutUs' ? 'activeItem' : 'inactiveItem'}
          to="/aboutUs">About Us
        </Link> */}
      </div>
    )
  }
}

export default LeftPane;
