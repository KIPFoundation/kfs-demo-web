import React, { Component } from 'react';
import { Image } from 'semantic-ui-react';
import './App.css';
import { Link } from "react-router-dom";
import KIP_LOGO from './kipLogo.png';

class LeftPane extends Component {
  render() {
    return (
      <div>
        <Image style={{width:'60%',margin:'20% 20% 15% 15%'}} src={KIP_LOGO}/>
        <InboxMenu />
      </div>
    );
  }
}

class InboxMenu extends Component {
  render() {
    const route = window.location.pathname;
    return (
      <div style={{marginLeft:'20%',width:'80%'}}>
        <div className={route === '/files' ? 'activeItem' : 'inactiveItem'}>
          <Link to="/files">My Files</Link>
        </div>
        <div className={route === '/filesShared' ? 'activeItem' : 'inactiveItem'}>
          <Link to="/filesShared">Files Shared Me</Link>
        </div>
        <div className={route === '/wrkspacesShared' ? 'activeItem' : 'inactiveItem'}>
          <Link to="/wrkspacesShared">Workspaces Shared Me</Link>
        </div>
        <div className={route === '/wrkspaces' ? 'activeItem' : 'inactiveItem'}>
          <Link to="/wrkspaces">My Workspaces</Link>
        </div>
      </div>
    )
  }
}

export default LeftPane;
