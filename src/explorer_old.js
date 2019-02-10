import React from 'react';
import "./StylingKfsComponents.css";
import LeftPane from "./leftPane";
import { BrowserRouter as Router, Route,Switch } from "react-router-dom";
import WelcomePage from "./welcome";
import AccountOptions from './accountOptions.js';
import FilesView from './filesView.js';
import WorkspacesView from './workspacesView.js'
import web3 from './web3.js';
import axios from 'axios';
import RightPaneComponent from './rightPaneComponents';
class WebExplorer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loggedInUser:'',
            files:[],
            sharedFiles:[],
            workspaces:[],
            sharedWorkspaces:[]
        }
    }

    async componentDidMount() {
        const accounts = await web3.eth.getAccounts();
        const b64OfPublicKeyOfUser = window.btoa(accounts[0].toLowerCase());
        this.fetchSitemapOfUser(b64OfPublicKeyOfUser);        
        this.setState({loggedInUser : b64OfPublicKeyOfUser});
    }

    fetchSitemapOfUser = (userExplorerName) => {
        const fetchingSiteMapURL = 'http://localhost:3000/explorer?AppName='+userExplorerName+'&senderPub='+userExplorerName;
        console.log(fetchingSiteMapURL);
        axios.get(fetchingSiteMapURL)
        .then( response => {
                this.renderAppContents(response.data);
        })
        .catch(error => {
            console.log(error);
        });
    }

    renderAppContents = async (siteMap) => {
        let tempInvitedFiles = [];
        let tempCreatedFiles = [];
        let tempInvitedApps = [];
        let tempCreatedApps = [];
        if(siteMap.InvitedFilesAndApps != null) { 
            for(let invitedFileOrApp of siteMap.InvitedFilesAndApps) {
                if(invitedFileOrApp.file_hash != undefined) {
                    tempInvitedFiles.push(invitedFileOrApp);
                }
                else {
                    tempInvitedApps.push(invitedFileOrApp);
                }
            }
        }
        if(siteMap.CreatedFilesAndApps != null) { 
            for(let createdFileOrApp of siteMap.CreatedFilesAndApps) {
                if(createdFileOrApp.file_hash != undefined) {
                    tempCreatedFiles.push(createdFileOrApp);
                }
                else {
                    tempCreatedApps.push(createdFileOrApp);
                }
            }
        }
        console.log(tempInvitedFiles);
        this.setState({ files:tempCreatedFiles,sharedFiles:tempInvitedFiles,sharedWorkspaces:tempInvitedApps,workspaces:tempCreatedApps});
    }


    render() {
        return (
            <div className="completePage">
                <Router>
                    <React.Fragment>
                        <div className="left_pane">
                            <LeftPane />
                        </div>
                        <div className="main_body">
                            <div style={{padding:'6% 5% 2% 10%',width:'100%'}}>
                                <h2>Krama File System</h2>
                                <hr />
                            </div>
                            <Switch>
                                <Route exact path="/" component={WelcomePage} />
                                <Route path="/files"
                                    render={() => 
                                        <FilesView content={this.state.files} />
                                    }/>
                                <Route path="/filesShared" 
                                    render={() => 
                                        <FilesView content={this.state.sharedFiles} />
                                    }/> 
                                <Route path="/wrkspacesShared"  
                                    render={() => 
                                        <WorkspacesView content={this.state.sharedWorkspaces} />
                                    }/>
                                <Route path="/wrkspaces"
                                    render={() => 
                                        <WorkspacesView content={this.state.workspaces} />
                                    }/>
                            </Switch>   
                        </div>
                        <div className="right_pane">
                            <div className="accountOptions">
                                <AccountOptions />
                            </div>
                            <RightPaneComponent />
                        </div>
                    </React.Fragment>
                </Router>
            </div>
        );
    }
}
export default WebExplorer;