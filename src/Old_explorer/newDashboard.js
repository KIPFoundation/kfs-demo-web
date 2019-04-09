import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Logo from './kipLogo.png';
import { Icon,Image } from 'semantic-ui-react';
import SenderView from './senderView';
// import ReceiverView from './receiverView';
// import FilesView from './explorer_old';
import FilesView from './explorerView';
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
                            <SideNav.Nav defaultSelected="drive">
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
                            <Route path="/" exact component={FilesView} />
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

// fetchContentOfFileAndRender = (fileToBeRead,fileName) => {
//     this.setState({ fetchFileContentAction:true,openedFileName:fileName });
//     const readingUrl = 'http://204.48.21.88:3000/read/'+fileToBeRead+'?reciPub=' + this.state.b64OfSender;
//       console.log(readingUrl);
//       axios.get(readingUrl)
//       .then( response => {
//         const returnType = response.headers['content-type'];
//         console.log(returnType);
//         if(response.data === false) {
//           console.log('UnAuthorized Attempt');
//         }
//         else {
//           if(returnType === 'image/jpeg' || returnType === 'image/png' || returnType === 'image/gif' || returnType === 'image/jpg') {
//             this.setState({ source:readingUrl });
//           }
//           else if(returnType === 'video/mp4' || returnType === 'video/quicktime' || returnType === 'video/x-flv' || returnType === 'video/x-msvideo' || returnType === 'video/x-matroska') {
//             const link = document.createElement('a');
//             link.href = readingUrl;
//             link.setAttribute('target', "_blank"); 
//             document.body.appendChild(link);
//             link.click();
//             this.setState({fetchFileContentAction : false});
//           }
//           else if(returnType === 'application/pdf') {
//               const link = document.createElement('a');
//               link.href = readingUrl;
//               link.setAttribute('target', "_blank"); 
//               document.body.appendChild(link);
//               link.click();
//               this.setState({fetchFileContentAction : false});
//           }
//           else {
//               const url = window.URL.createObjectURL(new Blob([response.data]));
//               const link = document.createElement('a');
//               link.href = url;
//               link.setAttribute('download', fileName); //or any other extension
//               document.body.appendChild(link);
//               link.click();
//               this.setState({fetchFileContentAction : false});
//           }
//         }
//       })
//       .catch((error) => {
//           this.setState({errorWhileFetching:'Error while fetching file content, this may be because you might deleted it',source:''});
//         console.log(error);
//     });
//   }