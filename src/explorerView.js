import React from 'react';
import { Icon,Modal,Header,Button,Image } from 'semantic-ui-react';
import web3 from './ethereum/web3.js';
import axios from 'axios';
import loadingGIF from './loader.gif';
import kfs from './ethereum/kfs.js';
// let receipentAndFileHashObject = {};
class Drive extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            sender:'',
            open:false,
            folders:[],
            files:[],
            pathTracker:[],
            pathTrackerContent:[],
            trackedPath:'',
            CreatedFiles:[],
            InvitedFiles:[],
            Workspaces:[],
            workspaceInnerContents:[],
            currentAppName:'',
            readRequest:false,
            imageContent:false,
            source:loadingGIF,
            VideoSource:'',
            openWorkspace:'',
            siteMap:'',
            fileLoading:false,
            backAction:'',
            openWorkspaceAction:false,
            fileToBeDeleted:'',
            removeToggle:false,
            workspacesThatHasAccess:[],
            createdWorkpaces:[],
            errorWhileFetching:'',
            driveEmpty:false,
            openModalToSeeFile:false,
            openFileName:'',
            deletionContent:'Delete the file',
            gridsOpen:[false,false,false,false]
        }
    }

    async componentDidMount() {
        this.setState({ loading:true });
        const accounts = await web3.eth.getAccounts();
        const b64Sender = window.btoa(accounts[0].toLowerCase());
        this.setState({sender : accounts[0]});
        // this.renderAppContents(example);
        this.fetchSitemap(b64Sender, b64Sender);
    }

    renderDrive = (explorer) => {
            this.setState({ readRequest:false })
            this.renderAppContents(explorer);
    }

    removeFile = () => {
        const b64Sender = window.btoa(this.state.sender.toLowerCase());
        // console.log(this.state.fileToBeDeleted+" : "+this.state.fileHashToBeDeleted+" : "+this.state.openWorkspace);
        const removeEndpoint = 'http://0.0.0.0:3000/Remove?appName='+this.state.openWorkspace+'&senderPub='+b64Sender+'&name='+this.state.fileToBeDeleted+'&hash='+this.state.fileHashToBeDeleted;
        console.log(removeEndpoint);
        axios.get(removeEndpoint)
        .then(response => {
            if(response.data == 'Permission denied') {
                this.setState({deletionContent:"Permission denied"});
            }
            else {
                this.setState({deletionContent:"File has Removed"});
            }
        })
        .catch(e => {
            console.log(e);
        })
    }


    fetchSitemap = (appName, senderPub) => {
        const fetchingSiteMapURL = 'http://0.0.0.0:3000/explorer?AppName='+appName+'&senderPub='+senderPub;
        console.log(fetchingSiteMapURL);
        axios.get(fetchingSiteMapURL)
        .then( response => {
            if(response.data){
               if(appName == senderPub){
                    this.setState({siteMap: response.data});
                }
                if(response.data.InvitedFilesAndApps == null && response.data.CreatedFilesAndApps == null) {
                    this.setState({loading:false,driveEmpty:true});
                }
                // if(response.data.CreatedFilesAndApps != null) {
                //     const arrayWithRecipentsAndFileHashes = this.state.siteMap.CreatedFiles;
                //     for(let row of arrayWithRecipentsAndFileHashes) {
                //         receipentAndFileHashObject[row.file_hash] = row.receiver_pub;
                //     }
                // }
                // if(response.data.InvitedFilesAndApps != null) { 
                //     const tempArrayWithRecipentsAndFileHashes = this.state.siteMap.InvitedFiles;
                //     for(let row of tempArrayWithRecipentsAndFileHashes) {
                //         receipentAndFileHashObject[row.file_hash] = senderPub;
                //     }
                // }  
                this.renderDrive(response.data);
            }
        })
        .catch(error => {
            console.log('Error in Fetching SiteMap --> ' + error);
            this.setState({loading:false,open:true});
        });
    }


    fetchSitemapOfWorkspace = (appName,benefactor) => {
        console.log(appName);
        this.setState({openWorkspace:appName,readRequest:true});
        const b64OfUser = window.btoa(this.state.sender.toLowerCase());
        // const userHelpingInFetching = benefactor == 'self' ? b64OfUser : benefactor;
        const url = 'http://0.0.0.0:3000/appdata/'+appName+'?reciPub='+b64OfUser;
        console.log(url);
        axios.get(url)
        .then( response => {
            const innerFiles = response.data.files;
            let innerContents = [];
            if(innerFiles!=null) {
                for(let innerFile of innerFiles) {
                    innerContents.push( ( <div className="card" key={innerFile.file_hash}>
                                                <div style={{width:'210px'}}
                                                onClick={() => this.renderFile(innerFile.file_hash,'getRecipent',[],innerFile.file_name,2)}>
                                                    <Icon name='file' />
                                                    <span>{innerFile.file_name}</span>
                                                </div>
                                                <Icon name='trash alternate outline' 
                                                    onClick={(e) => 
                                                    this.setState({fileToBeDeleted : innerFile.file_name , fileHashToBeDeleted: innerFile.file_hash, removeToggle:true})} />
                                        </div>) );
                }
            }
            this.setState({openWorkspaceAction:true,removeToggle:false,workspaceInnerContents:innerContents})
        })
        .catch(error => {
            console.log(error);
            this.setState({removeToggle:false});
        });      
    }

    renderFile = (fileToBeRead, receipentAddress, appHistory,fileName,iteration) => {
        // this.setState({readRequest:true,appHistory:appHistory,source:'',fileLoading:true,openWorkspaceAction:false});
        this.setState({openModalToSeeFile:true,openFileName:fileName,errorWhileFetching:''})
        // const b64OfSender = window.btoa(this.state.sender.toLowerCase());
        const b64OfReceipent = window.btoa(this.state.sender.toLowerCase());
        // Check this for rendering of files
        // let b64OfReceipent;
        // if(receipentAddress == 'getRecipent')
        // {
        //     b64OfReceipent = receipentAndFileHashObject[fileToBeRead];
        // }
        // else {
        //      b64OfReceipent = receipentAddress == 'self' ? b64OfSender : receipentAddress;
        // }
        
        const readingUrl = 'http://0.0.0.0:3000/read/'+fileToBeRead+'?reciPub=' + b64OfReceipent;
        console.log(readingUrl);
        axios.get(readingUrl)
        .then( response => {
          const returnType = response.headers['content-type'];
          console.log(returnType);
          if(response.data === false) {
            console.log('UnAuthorized Attempt');
          }
          else {
            if(returnType === 'image/jpeg' || returnType === 'image/png' || returnType === 'image/gif' || returnType === 'image/jpg') {
              this.setState({source:readingUrl, imageContent:true , fileLoading:false});
            }
            else if(returnType == 'video/mp4' || returnType == 'video/quicktime' || returnType == 'video/x-flv' || returnType == 'video/x-msvideo' || returnType == 'video/x-matroska') {
                const url = window.URL.createObjectURL(new Blob([readingUrl]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName); 
                document.body.appendChild(link);
                link.click();
                this.setState({openModalToSeeFile : false});
            }
            else if(returnType == 'application/pdf') {
                this.setState({readRequest : false});
                const link = document.createElement('a');
                link.href = readingUrl;
                link.setAttribute('target', "_blank"); 
                document.body.appendChild(link);
                link.click();
                this.setState({openModalToSeeFile : false});
            }
            else {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName); //or any other extension
                document.body.appendChild(link);
                link.click();
                this.setState({openModalToSeeFile : false});
            }
          }
        })
        .catch((error) => {
            this.setState({errorWhileFetching:'Error while fetching file content, this may be because you might deleted it',source:''});
          console.log(error);
      });
        this.setState({loading:false,backAction:iteration}); //remove this afterwards
    }

    renderAppContents = async (siteMap) => {
        let tempInvitedFiles = [];
        let tempCreatedFiles = [];
        let tempInvitedApps = [];
        let tempCreatedApps = [];
        if(siteMap.InvitedFilesAndApps != null) { //change to InvitedFilesApps
        for(let invitedFile of siteMap.InvitedFilesAndApps) {
            let invitedFileOrApp;
            if(invitedFile.file_hash != undefined) {
                invitedFileOrApp = (
                    <div className="card" key={invitedFile.file_hash}>
                        <div style={{width:'210px'}}
                            onClick={() => this.renderFile(invitedFile.file_hash, 'self', siteMap.app_name,invitedFile.file_name,1)}>
                                <Icon name='file' />
                                <span>{invitedFile.file_name}</span>
                        </div>
                        {/* <Icon name='trash alternate outline' 
                            onClick={(e) => 
                                this.setState({fileToBeDeleted : invitedFile.file_name , fileHashToBeDeleted: invitedFile.file_hash, removeToggle:true})} /> */}
                    </div>
                );
                tempInvitedFiles.push(invitedFileOrApp);
            }
            else {
            invitedFileOrApp = (
                <div className="card" key={invitedFile.app_hash}
                    onClick={() => this.fetchSitemapOfWorkspace(invitedFile.app_name,'self')}>
                    <div>
                            <Icon name='folder' />
                            <span>{invitedFile.app_name}</span>
                    </div>
                </div>
            );
            tempInvitedApps.push(invitedFileOrApp);
            }
        }}
        if(siteMap.CreatedFilesAndApps != null) { //change here as well
        for(let createdFile of siteMap.CreatedFilesAndApps) {
            let createdFileOrApp;
            if(createdFile.file_hash != undefined) {
                createdFileOrApp = (
                    <div className="card" key={createdFile.file_hash}>
                        <div style={{width:'210px'}}
                            onClick={() => this.renderFile(createdFile.file_hash,createdFile.receiver_pub, siteMap.app_name,createdFile.file_name,1)}>
                                <Icon name='file' />
                                <span>{createdFile.file_name}</span>
                        </div>
                        {/* <Icon name='trash alternate outline' 
                            onClick={(e) => 
                                this.setState({fileToBeDeleted : createdFile.file_name , fileHashToBeDeleted: createdFile.file_hash, removeToggle:true})} /> */}
                    </div>
                );
                tempCreatedFiles.push(createdFileOrApp);
            }
            else {
                createdFileOrApp = (
                <div className="card" key={createdFile.app_hash}
                    onClick={() => this.fetchSitemapOfWorkspace(createdFile.app_name,createdFile.receiver_pub)}>
                    <div>
                            <Icon name='folder' />
                            <span>{createdFile.app_name}</span>
                    </div>
                </div>
            );
            tempCreatedApps.push(createdFileOrApp);
            }}
        }
        // let currentWorkspace = siteMap.app_name;
        this.setState({ openWorkspaceAction:false,readRequest:false, createdWorkpaces:tempCreatedApps,workspacesThatHasAccess:tempInvitedApps , InvitedFiles:tempInvitedFiles, CreatedFiles:tempCreatedFiles, open:false, loading:false})
    }

    renderWorkspaces = async () => {
        this.setState({ Workspaces : [] });
        const kfsAppsReplicated = await kfs.methods.getAppsOfOwner().call({from:this.state.sender});
        // console.log(await kfs.methods.getAppOwner(kfsAppsReplicated[1].appName).call({from : this.state.sender}));
        let pieSet1 = new Set();
        let kfsApps = [];
        let j1 = 0;
        for(let i=0;i<kfsAppsReplicated.length;i++)  {
            if(!pieSet1.has(kfsAppsReplicated[i].appName)) {
                kfsApps[j1] = kfsAppsReplicated[i];
                j1++;
                pieSet1.add(kfsAppsReplicated[i].appName);
            }
        }
        let tempWorkspaces = [];
        for(let workspace of kfsApps) {
            //uncomment first onClick event and comment second onclick once sitemap is ready
            // The second param in the fetchSitemap function should be the senderPub (in base64 encoded format) 
            const currentAppName = web3.utils.hexToUtf8(workspace.appName)
            tempWorkspaces.push( (<button className="card" key={workspace.appName}
                                        onClick={() => this.fetchSitemapOfWorkspace(workspace.appName)}>                                        
                                           {/* onClick={() => {
                                            this.setState({openWorkspace:currentAppName})
                                            this.renderAppContents(siteMap)}
                                        }>  */}
                                            <Icon name='folder' />
                                            <span>{currentAppName}</span>
                                        </button>) );
        }

        this.setState({ Workspaces : tempWorkspaces , loading:false});
    }

    signUpWithb64 = () => {
        this.setState({loading:true});
        const b64OfSender =  window.btoa(this.state.sender.toLowerCase());
        const creatingDefaultAppIdUrl = 'http://0.0.0.0:3000/createAppID/'+b64OfSender+'?sender='+b64OfSender;
        console.log(creatingDefaultAppIdUrl);
        axios.get(creatingDefaultAppIdUrl)
        .then( response => {
            console.log(response.data);
            this.fetchSitemap(b64OfSender,b64OfSender);
        })
        .catch(error => {
          this.setState({loading:false,open:true})
        });
    }

    loadingComponent = () => {
        return (
            <div style={{padding:'5% 10% 10% 15%'}}>
                <center>
                <img height="150px" width="150px;" style={{marginTop : '100px'}} src={ loadingGIF } />
                </center>
            </div>
        );
    }

    openOrCloseDesiredGrid = (index,booleanValue) => {
        let tempGridBooleans = this.state.gridsOpen;
        tempGridBooleans[index] = booleanValue;
        this.setState({gridsOpen : tempGridBooleans});
    }

    render() {
        // let pathRoutes = [];
        // let i=1;
        // pathRoutes[0] = (
        //     <div style={{display:'flex'}} className="pathBlock">
        //         <div onClick={() => this.renderDrive()}>My KFS Drive</div>
        //         <span style={{marginLeft:'6px'}}>&gt;</span>
        //     </div>
        // );
        // if(this.state.openWorkspace != '') {
        //     pathRoutes[1] = (
        //         <div style={{display:'flex'}} className="pathBlock">
        //             <div onClick={() => this.renderAppContents(this.state.siteMap)}>{this.state.openWorkspace}</div>
        //             <span style={{marginLeft:'10px'}}>&gt;</span>
        //         </div>
        //     );
        // }

        

        // const header = (
        //     <div style={{display:'flex'}}>
        //         <span style={{marginRight:'650px'}}>MY KFS DRIVE</span>
        //         <Button onClick={() => window.location = "/create"} icon labelPosition='right'>
        //             Create Workspace
        //          <Icon name='plus' />
        //         </Button>
        //     </div>
        // );
        if(this.state.loading) {
            return (
            <div style={{backgroundColor:'white',padding:'5% 10% 10% 15%'}}>
                <center>
                <img height="150px" width="150px;" style={{marginTop : '100px'}} src={ loadingGIF } />
                </center>
            </div>
                
            );
        }
        else {
            if(this.state.driveEmpty) {
                return (
                    <div style={{paddingTop:'300px',backgroundColor:'#ffffff'}}>
                        <center>
                            <h1>Your Inbox is empty</h1>
                        </center>
                    </div>
                );
            }
            if(this.state.readRequest) {
                /* uncomment first button and uncomment second once sitemap is ready */
                if(this.state.fileLoading) {    
                    return (
                        <div>
                         <Button style={{marginLeft:'100px'}} icon
                            onClick={() => this.renderDrive(this.state.siteMap)}>
                                   BACK
                         <Icon name='left arrow' style={{float: 'left'}}/>
                        </Button>
                        <div style={{backgroundColor:'#e6e6e6',height:'700px',border:'1px solid #',width:'80%',padding:'5%',margin:'5% 10% 5% 12%'}}>
                            {this.loadingComponent()}
                        </div>
                      </div>
                    );  
                } 
                else {
                return (
                    <div> 
                     <Button style={{marginLeft:'100px',marginBottom:'30px'}} icon
                        onClick={() => {
                            // if(this.state.backAction == 2) {
                            //     this.setState({openWorkspaceAction:true,backAction:1});
                            // }
                            // else {
                                this.renderDrive(this.state.siteMap)}
                            // }   
                        }>
                               BACK
                     <Icon name='left arrow' style={{float: 'left'}}/>
                    </Button>
                    <div style={{backgroundColor:'white',padding:'5% 10% 10% 15%'}}>
                    <div style={{fontSize:'24px',marginLeft:'30px',display:'flex'}}>{this.state.openWorkspace}</div>
                    <hr />
                        <h3 style={{marginLeft:'35px',marginTop:'10px'}}>Files</h3>
                        <div className="grid_css">
                            {this.state.workspaceInnerContents}
                        </div>
                    </div>
                    <div>
                        <Modal basic size='small' open={this.state.removeToggle} >
                            <Header icon='trash alternate' content={this.state.deletionContent} />
                            <Modal.Content>
                                {this.state.deletionContent == 'Delete the file'?
                                <p>
                                    Are you sure that you want to delete the file called <b>{this.state.fileToBeDeleted}</b>
                                </p> :''}
                                </Modal.Content>
                            {this.state.deletionContent == 'Delete the file'?
                            <Modal.Actions>
                                <Button onClick={() => {
                                    ;this.setState({removeToggle:false});
                                }} basic color='red' inverted>
                                    <Icon name='remove' /> No
                                </Button>
                                <Button onClick={() => this.removeFile()} color='green' inverted>
                                    <Icon name='checkmark' /> Yes
                                </Button>
                            </Modal.Actions> :
                            <Modal.Actions>
                                <Button onClick={() => this.fetchSitemapOfWorkspace(this.state.openWorkspace)} basic color='green' inverted>
                                    <Icon name='remove' /> Close
                                </Button>
                            </Modal.Actions> 
                            }
                        </Modal>
                    </div>
                    {this.state.openModalToSeeFile? 
                            <div className="modal">
                                <div className="modal-content">
                                    <span style={{color:'white',fontSize:'24px'}}>{this.state.openFileName}</span>
                                    <span onClick={() => this.setState({openModalToSeeFile:false,source:loadingGIF})} className="close">&times;</span>
                                    {this.state.source == loadingGIF ? 
                                        <center>
                                            {this.loadingComponent()}
                                        </center> :
                                        <center>
                                            <Image style={{width:'40%',marginTop:'7%'}} src={this.state.source} />
                                        </center>
                                    }
                                    {this.state.errorWhileFetching != '' ? 
                                        <span style={{color:'white',fontSize:'24px'}} >{this.state.errorWhileFetching}</span> : ''}
                                </div>
                            </div>
                        : ''}
                  </div>
                );
            }}
            else {
            if(this.state.open) {
                return (
                    <div>
                        <Modal open={this.state.open} basic size='small'>
                            <Header icon='signup' content='SignUp to KFS' />
                            <Modal.Content>
                            <p>
                                Could'nt found you in our DB, Please sign up we you didn't created account earlier
                            </p>
                            </Modal.Content>
                            <Modal.Actions>
                            {/* <Button basic color='red' inverted>
                                <Icon name='remove' /> Later
                            </Button> */}
                            <Button onClick={() => this.signUpWithb64()} color='green' inverted>
                                <Icon name='checkmark' /> SignUp
                            </Button>
                            </Modal.Actions>
                        </Modal>
                    </div>
                );
            }
            else {
                return (
                    <div style={{backgroundColor:'white',padding:'5% 10% 10% 15%',height:'750px',overflow: 'auto'}}>
                        <div style={{fontSize:'24px',marginLeft:'30px',display:'flex'}}>MY KFS DRIVE</div>
                        <hr style={{marginBottom:'30px'}}/>
                        {this.state.workspacesThatHasAccess.length!=0 ?
                            <div style={{marginBottom:'30px',paddingLeft:'20px'}}>
                                <div className="grid_box" onClick={()=>this.openOrCloseDesiredGrid(0,!this.state.gridsOpen[0])}>
                                    <h3 style={{marginLeft:'15px',marginTop:'10px'}}>
                                        <Icon style={{height:'100%',fontSize:'30px',width:'100px',float:'right'}} 
                                            name={this.state.gridsOpen[0] ? 'angle down' : 'angle right'} />
                                            Workspaces Shared With Me
                                    </h3>
                                </div>
                                {this.state.gridsOpen[0] ?
                                <div className="grid_css">
                                    {this.state.workspacesThatHasAccess}
                                </div> : ''}
                            </div> : ''
                        }
                        {this.state.createdWorkpaces.length!=0 ?
                            <div style={{marginBottom:'30px',paddingLeft:'20px'}}>
                                <div className="grid_box" onClick={()=>this.openOrCloseDesiredGrid(1,!this.state.gridsOpen[1])}>
                                    <h3 style={{marginLeft:'15px',marginTop:'10px'}}>
                                        <Icon style={{height:'100%',fontSize:'30px',width:'100px',float:'right'}}
                                            name={this.state.gridsOpen[1] ? 'angle down' : 'angle right'} />
                                        My Workspaces
                                    </h3>
                                </div>
                                {this.state.gridsOpen[1] ?
                                <div className="grid_css">
                                    {this.state.createdWorkpaces}
                                </div> :''}
                            </div> : ''
                        }
                        {this.state.InvitedFiles.length!=0 ?
                            <div style={{marginBottom:'30px',paddingLeft:'20px'}}>
                                <div className="grid_box" onClick={()=>this.openOrCloseDesiredGrid(2,!this.state.gridsOpen[2])}>
                                    <h3 style={{marginLeft:'15px',marginTop:'10px'}}>
                                        <Icon style={{height:'100%',fontSize:'30px',width:'100px',float:'right'}} 
                                            name={this.state.gridsOpen[2] ? 'angle down' : 'angle right'} />
                                        Files Shared With Me
                                    </h3>
                                </div>
                                {this.state.gridsOpen[2] ?
                                <div className="grid_css">
                                    {this.state.InvitedFiles}
                                </div> : ''}
                            </div> : ''
                        }
                        {this.state.CreatedFiles.length!=0 ?
                            <div style={{marginBottom:'30px',paddingLeft:'20px'}}>
                                <div className="grid_box" onClick={()=>this.openOrCloseDesiredGrid(3,!this.state.gridsOpen[3])}>
                                    <h3 style={{marginLeft:'15px',marginTop:'10px'}}>
                                        <Icon style={{height:'100%',fontSize:'30px',width:'100px',float:'right'}} 
                                            name={this.state.gridsOpen[3] ? 'angle down' : 'angle right'} />
                                        My Files
                                    </h3>
                                </div>
                                {this.state.gridsOpen[3] ?
                                <div className="grid_css">
                                    {this.state.CreatedFiles}
                                </div> : ''}
                            </div> : ''
                        }
                        {/* {this.state.Workspaces.length!=0 ?
                            <div>
                                <h3 style={{marginLeft:'35px',marginTop:'10px'}}>Workspaces</h3>
                                <div className="grid_css">
                                    {this.state.Workspaces}
                                </div>
                            </div> : ''
                        } */}
                        {/* <div>
                            <Modal basic size='small' open={this.state.removeToggle} >
                                <Header icon='trash alternate' content='Delete the file' />
                                <Modal.Content>
                                <p>
                                    Are you sure that you want to delete the file called <b>{this.state.fileToBeDeleted}</b>
                                </p>
                                </Modal.Content>
                                <Modal.Actions>
                                <Button onClick={() => this.setState({removeToggle:false})} basic color='red' inverted>
                                    <Icon name='remove' /> No
                                </Button>
                                <Button onClick={() => this.removeFile()} color='green' inverted>
                                    <Icon name='checkmark' /> Yes
                                </Button>
                                </Modal.Actions>
                            </Modal>
                        </div> */}
                        {this.state.openModalToSeeFile? 
                            <div className="modal">
                                <div className="modal-content">
                                    <span style={{color:'white',fontSize:'24px'}}>{this.state.openFileName}</span>
                                    <span onClick={() => this.setState({openModalToSeeFile:false,source:loadingGIF})} className="close">&times;</span>
                                    {this.state.source == loadingGIF ? 
                                        <center>
                                            {this.loadingComponent()}
                                        </center> :
                                        <center>
                                            <Image style={{width:'40%',marginTop:'7%'}} src={this.state.source} />
                                        </center>
                                    }
                                    {this.state.errorWhileFetching != '' ? 
                                        <span style={{color:'white',fontSize:'24px'}} >{this.state.errorWhileFetching}</span> : ''}
                                </div>
                            </div>
                        : ''}
                    </div> 
                );
            } // end of modal open ie., signup 
        } // end of readRequest if else  
        } // end of loading if else
    }
}

export default Drive;