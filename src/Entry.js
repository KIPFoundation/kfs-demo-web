import React from 'react';
import LeftPane from "./Explorer/leftPane";
import { BrowserRouter as Router, Route,Switch } from "react-router-dom";
import WelcomePage from "./Explorer/welcome";
import ContentView from './Explorer/ContentView.js'
import web3 from './miscellaneous/web3.js';
import axios from 'axios';
import './App.css';
class WebExplorer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loggedInUser:'',
            home:[],
            sharing:[],
            isFileUploaded:true,
            searchBoxOnFocusAction:false,
            existingApps:[]
        }
    }

    async componentDidMount() {
        const accounts = await web3.eth.getAccounts();
        const b64OfPublicKeyOfUser = window.btoa(accounts[0].toLowerCase());
        this.setState({loggedInUser : b64OfPublicKeyOfUser});
        this.fetchSitemapOfUser();        
    }

    fetchSitemapOfUser = () => {
        const userExplorerName = this.state.loggedInUser;
        const fetchingSiteMapURL = 'http://204.48.21.88:3000/explorer?AppName='+userExplorerName+'&senderPub='+userExplorerName;
        console.log(fetchingSiteMapURL);
        axios({
            method:'get',
            url: fetchingSiteMapURL,
            auth: {
                username: 'sai',
                password: '123'
            }
        })
        .then( response => {
            console.log(response);
            const siteMap = response.data;
            let i = 1;
            let tempOwnedApps = [{
                key : "Root Folder",
                value : 'Drive',
                text : <span style={{fontSize:'10px'}}>{"Kfs Drive"}</span>
            }];
            if(siteMap.InvitedFilesAndApps != null)
            for(let invitedFile of siteMap.InvitedFilesAndApps) {
              if(invitedFile.app_name !== undefined) {
                tempOwnedApps[i++] = {
                              key : invitedFile.app_hash,
                              value : invitedFile.app_name,
                              text : <span style={{fontSize:'10px'}}>{invitedFile.app_name}</span>
                            };
              }
            }
            if(siteMap.CreatedFilesAndApps != null)
            for(let createdFile of siteMap.CreatedFilesAndApps) {
              if(createdFile.app_name !== undefined) {
                tempOwnedApps[i++] = {
                              key : createdFile.app_hash,
                              value : createdFile.app_name,
                              text : <span style={{fontSize:'10px'}}>{createdFile.app_name}</span>
                            };
              }
            }
            this.setState({existingApps : tempOwnedApps});
            this.renderAppContents(siteMap);
        })
        .catch(error => {
            console.log(error);
        });
    }

    renderAppContents = async (siteMap) => {
        let tempInvitedAppsnFiles = [];
        let tempCreatedAppsnFiles = [];
        if(siteMap.InvitedFilesAndApps != null) { 
            tempInvitedAppsnFiles = siteMap.InvitedFilesAndApps;
        }
        if(siteMap.CreatedFilesAndApps != null) { 
            tempCreatedAppsnFiles = siteMap.CreatedFilesAndApps;
        }
        this.setState({sharing :tempInvitedAppsnFiles, home : tempCreatedAppsnFiles});
    }

    uploadFileToKFS = (file) => {
        this.setState({isFileUploaded:false});
        const data = new FormData();
        data.append('file', file);
        data.append('senderPub', this.state.loggedInUser);
        data.append('reciPub', this.state.loggedInUser);
        axios.post('http://204.48.21.88:3000/upload', data)
        .then( response => {
            this.setState({isFileUploaded : true});
        })
        .catch(error => {
            console.log(error);
        });
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
                            <Switch>
                                <Route exact path="/" component={WelcomePage} />
                                <Route path="/home"
                                    render={() => 
                                        <ContentView content={this.state.home} />
                                    }/>
                                <Route path="/sharing" 
                                    render={() => 
                                        <ContentView content={this.state.sharing} />
                                    }/> 
                                {/* <Route path="/aboutUs" component={WelcomePage} /> */}
                            </Switch>   
                        </div>
                    </React.Fragment>
                </Router>
            </div>
        );
    }
}
export default WebExplorer;
