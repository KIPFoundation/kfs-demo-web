import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Logo from './kipLogo.png';
import { Icon,Image } from 'semantic-ui-react';
import SenderView from './senderView';
// import ReceiverView from './receiverView';
import FilesView from './explorer_new';
// import FilesView from './explorer_old';
import CreateApp from './createApp';
// import XmlForm from './xmlForm';

class Dashboard extends Component {
    render() {
        return (
        <div style={{backgroundColor:"black",overflow:'auto'}}>
            <div style={{display:'flex'}}>
                <div style={{marginLeft:'45%'}}>
                    <h1 style={{color:'white'}}>KFS DEMO</h1>
                </div>
                <div style={{marginLeft:'32%'}}>
                    <Image style={{height:"50px",width:"150px"}} src={Logo} avatar />
                </div>
            </div>
            <Router>
                <Route render={({ location, history }) => (
                    <React.Fragment>
                        <SideNav style={{backgroundColor:'#262626'}}
                            onSelect={(selected) => {
                                const to = '/' + selected;
                                if (location.pathname !== to) {
                                    history.push(to);
                                }
                            }}>
                            <SideNav.Toggle />
                            <SideNav.Nav defaultSelected="send">
                                <NavItem eventKey="send">
                                    <NavIcon>
                                        <Icon style={{ fontSize: '1.75em' }} link name='send' />
                                    </NavIcon>
                                    <NavText>
                                       Send / Upload File
                                    </NavText>
                                </NavItem>
                                {/* <NavItem eventKey="upload">
                                    <NavIcon>
                                        <Icon style={{ fontSize: '1.75em' }} link name='upload' />
                                    </NavIcon>
                                    <NavText>
                                        Upload File to KFS
                                    </NavText>
                                </NavItem> */}
                                <NavItem eventKey="create">
                                    <NavIcon>
                                        <Icon style={{ fontSize: '1.75em' }} link name='folder open outline' />
                                    </NavIcon>
                                    <NavText>
                                        Create Folder
                                    </NavText>
                                </NavItem>
                                <NavItem eventKey="drive">
                                    <NavIcon>
                                        <Icon style={{ fontSize: '1.75em' }} link name='suitcase' />
                                    </NavIcon>
                                    <NavText>
                                        KFS Drive
                                    </NavText>
                                </NavItem>
                                {/* <NavItem eventKey="read">
                                    <NavIcon>
                                        <Icon style={{ fontSize: '1.75em' }} link name='find' />
                                    </NavIcon>
                                    <NavText>
                                       Read File
                                    </NavText>
                                </NavItem> */}
                                {/* <NavItem eventKey="xmlForm">
                                    <NavIcon>
                                        <Icon style={{ fontSize: '1.75em' }} link name='file code outline' />
                                    </NavIcon>
                                    <NavText>
                                       XML Parsing
                                    </NavText>
                                </NavItem> */}
                            </SideNav.Nav>
                        </SideNav>
                        <main>
                            <Route path="/" exact component={SenderView} />
                            <Route path="/send" component={SenderView} />
                            {/* <Route path="/upload" component={SenderView} /> */}
                            <Route path="/create" component={CreateApp} />
                            <Route path="/drive" component={FilesView} />
                            {/* <Route path="/read" component={ReceiverView} /> */}
                            {/* <Route path="/xmlForm" component={XmlForm} /> */}
                        </main>
                    </React.Fragment>
                )}
                />
            </Router>
        </div>
        );
    }
}

export default Dashboard;