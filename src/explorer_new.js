import React from 'react';
// import ExplorerView from './explorerView';
import { Icon,Modal,Header,Button,Image } from 'semantic-ui-react';
import web3 from './ethereum/web3.js';
import axios from 'axios';
import loadingGIF from './loader.gif';
import kfs from './ethereum/kfs.js'

const siteMap = 
            {
                "app_name": "MHg4YzA1OWUyMzg5MGFkNmUyYTQyM2ZiNTIzNTk1NmUxN2M3YzkyZDdm",
                "app_id": "QmR2F7VAvKccE5vKuPUqC2bPN91pnSSfxhywq9zzpm6vCk",
                "InvitedFiles": [
                    {
                        "file_name": "ScreenShot2019-01-15at7.59.12PM.png",
                        "file_hash": "QmSLSH4hsT9wumYPRycc2uMa1cHJxLRNGV6dJW1K5vavLX",
                        "sender_pub":"MHg5ZjJjOTVjZGM5NjBiNmEyYmI5Zjg4M2I0Nzg2MTliZWFkMWM1N2Vl"
                    },
                    {
                        "file_name": "ScreenShot2019-01-15at7.59.12PM.png",
                        "file_hash": "QmSLSH4hsT9wumYPRycc2uMa1cHJxLRNGV6dJW1K5vavLX",
                        "sender_pub":"MHg5ZjJjOTVjZGM5NjBiNmEyYmI5Zjg4M2I0Nzg2MTliZWFkMWM1N2Vl"
                    },
                    {
                        "file_name": "ScreenShot2019-01-15at7.59.12PM.png",
                        "file_hash": "QmSLSH4hsT9wumYPRycc2uMa1cHJxLRNGV6dJW1K5vavLX",
                        "sender_pub":"MHg5ZjJjOTVjZGM5NjBiNmEyYmI5Zjg4M2I0Nzg2MTliZWFkMWM1N2Vl"
                    }
                ],
                "CreatedFiles": [
                    {
                        "file_name": "ScreenShot2019-01-15at7.59.12PM.png",
                        "file_hash": "QmSLSH4hsT9wumYPRycc2uMa1cHJxLRNGV6dJW1K5vavLX"
                    },
                    {
                        "file_name": "ScreenShot2019-01-15at7.59.12PM.png",
                        "file_hash": "QmSLSH4hsT9wumYPRycc2uMa1cHJxLRNGV6dJW1K5vavLX"
                    }
                ]
            };
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
            currentAppName:'',
            readRequest:false,
            imageContent:false,
            source:'',
            videoContent:false,
            VideoSource:'',
            videoType:'',
            openWorkspace:''
        }
    }

    async componentDidMount() {
        this.setState({loading:true});
        const accounts = await web3.eth.getAccounts();
        const b64Sender = window.btoa(accounts[0].toLowerCase());
        this.setState({sender : accounts[0]});
        /* we can uncomment below statement once route is fixed to allow user signup if not exists */ 
        // this.letTosignUpOrRenderDrive(b64Sender);

       this.renderDrive();
    }

    renderDrive = () => {
        this.renderAppContents(siteMap);
        this.renderWorkspaces();
        this.setState({openWorkspace:''})
    }

    fetchSitemap = (appName) => {
        const fetchingSiteMapURL = 'http://204.48.21.88:3000/appdata/'+appName+'?sender='+appName;
        axios.get(fetchingSiteMapURL)
        .then( response => {
            this.renderAppContents(response.data);
        })
        .catch(error => {
            console.log('Error in Fetching SiteMap --> ' + error);
        });
    }
    // letTosignUpOrRenderDrive = (defaultAppName) => {
    //     const fetchingSiteMapURL = 'http://204.48.21.88:3000/appdata/'+defaultAppName+'?sender='+defaultAppName;
    //     axios.get(fetchingSiteMapURL)
    //     .then( response => {  
    //         this.renderDriveContents(response.data);
    //     })
    //     .catch(error => {
            /* if Doesn't exist have open modal and ask for signup in modal */
    //       this.setState({loading:false,open:true})
    //     });
    // }

    renderFile = (fileToBeRead,receipentAddress,appHistory) => {
        this.setState({readRequest:true,appHistory:appHistory});
    //     const b64OfSender = window.btoa(this.state.sender.toLowerCase());
    //     const b64OfReceipent = receipentAddress == 'self' ? b64OfSender : receipentAddress;
    //     const readingUrl = 'http://204.48.21.88:3000/read/'+fileToBeRead+'?senderPub='+b64OfSender+'&reciPub='+b64OfReceipent;
    //     axios.get(readingUrl)
    //     .then( response => {
    //       const returnType = response.headers['content-type'];
    //       if(response.data === false) {
    //         console.log('UnAuthorized Attempt');
    //       }
    //       else {
    //         if(returnType === 'image/jpeg' || returnType === 'image/png' || returnType === 'image/gif') {
    //           this.setState({source:readingUrl,imageContent:true});
    //         }
    //         else if(returnType == 'video/mp4' || returnType == 'video/mov') {
    //             this.setState({VideoSource:readingUrl,videoContent:true,videoType:returnType});
    //         }
    //       }
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //   });
        this.setState({imageContent:true}); //remove this afterwards
    }

    renderAppContents = async (siteMap) => {
        let tempInvitedFiles = [];
        for(let invitedFile of siteMap.InvitedFiles) {
            tempInvitedFiles.push( (<button className="card" 
                                        onClick={() => this.renderFile(invitedFile.file_hash,invitedFile.sender_pub,siteMap.app_name)}>
                                            <Icon name='file' />
                                            <span>{invitedFile.file_name}</span>
                                        </button>) );
        }
        let tempCreatedFiles = [];
        for(let createdFile of siteMap.CreatedFiles) {
            tempCreatedFiles.push( (<button className="card" 
                                        onClick={() => this.renderFile(createdFile.file_hash,'self',siteMap.app_name)}>
                                            <Icon name='file' />
                                            <span>{createdFile.file_name}</span>
                                        </button>) );
        }
        let currentWorkspace = siteMap.app_name;
        this.setState({ readRequest:false, Workspaces : [] , InvitedFiles : tempInvitedFiles,CreatedFiles : tempCreatedFiles,loading:false,open:false})
    }

    renderWorkspaces = async () => {
        const kfsAppsReplicated = await kfs.methods.getAppsOfOwner().call({from:this.state.sender});
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
            const currentAppName = web3.utils.hexToAscii(workspace.appName)
            tempWorkspaces.push( (<button className="card" 
                                        // onClick={() => this.fetchSitemap(workspace.appName)}>
                                        onClick={() => {
                                            this.setState({openWorkspace:currentAppName})
                                            this.renderAppContents(siteMap)}
                                        }> 
                                            <Icon name='folder' />
                                            <span>{currentAppName}</span>
                                        </button>) );
        }

        this.setState({ Workspaces : tempWorkspaces });
    }

    // signUpWithb64 = () => {
    //     this.setState({loading:true});
    //     const b64OfSender =  window.btoa(this.state.sender.toLowerCase());
    //     const creatingAppIdUrl = 'http://204.48.21.88:3000/createApp/'+b64OfSender+'?sender='+b64OfSender;
    //     axios.get(creatingAppIdUrl)
    //     .then( response => {
    //         console.log(response.data);
    //         this.letTosignUpOrRenderDrive(b64OfSender);
    //     })
    //     .catch(error => {
    //       this.setState({loading:false,open:true})
    //     });
    // }

    render() {
        let pathRoutes = [];
        let i=1;
        pathRoutes[0] = (
            <div style={{display:'flex'}} className="pathBlock">
                <div onClick={() => this.renderDrive()}>My KFS Drive</div>
                <span style={{marginLeft:'6px'}}>&gt;</span>
            </div>
        );
        if(this.state.openWorkspace != '') {
            pathRoutes[1] = (
                <div style={{display:'flex'}} className="pathBlock">
                    <div onClick={() => this.renderAppContents(siteMap)}>{this.state.openWorkspace}</div>
                    <span style={{marginLeft:'10px'}}>&gt;</span>
                </div>
            );
        }

        // const header = (
        //     <div style={{display:'flex'}}>
        //         <span style={{marginRight:'650px'}}>{this.state.pathTracker}</span>
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
            if(this.state.readRequest) {
                /* uncomment first button and uncomment second once sitemap is ready */
                return (
                    <div>
                     {/* <Button style={{marginLeft:'100px'}} icon labelPosition='LEFT'
                        onClick={() => this.renderAppContents(siteMap)}>
                            BACK
                     <Icon name='left arrow' />
                    </Button> */}
                     <Button style={{marginLeft:'100px'}} icon labelPosition='LEFT'
                        onClick={() => this.renderAppContents(siteMap)}>
                            BACK
                     <Icon name='left arrow' />
                    </Button>
                    <div style={{backgroundColor:'#e6e6e6',height:'700px',border:'1px solid #',width:'80%',padding:'5%',margin:'5% 10% 5% 12%'}}>
                        {this.state.imageContent ? <Image style={{width:'50%'}} src={loadingGIF} /> : ''}
                        {this.state.videoBoolean? <video width="100%" height="400" controls>
                                                            <source src={this.state.VideoSource} type={this.state.videoType} />
                                                            Your browser does not support the video tag.
                                                            </video> :''}
                    </div>
                  </div>
                );
            }
            else {
            if(this.state.open) {
                return (
                    <div>
                        <Modal open={this.state.open} basic size='small'>
                            <Header icon='signup' content='SignUp to KFS' />
                            <Modal.Content>
                            <p>
                                Could'nt found you in our DB, Please sign up!
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
                    <div style={{backgroundColor:'white',padding:'5% 10% 10% 15%'}}>
                    <div style={{fontSize:'24px',marginLeft:'30px',display:'flex'}}>{pathRoutes}</div>
                        <hr />
                        {this.state.CreatedFiles.length!=0 ?
                            <div>
                                <h3 style={{marginLeft:'35px',marginTop:'10px'}}>Created Files</h3>
                                <div className="grid_css">
                                    {this.state.CreatedFiles}
                                </div>
                            </div> : ''
                        }
                        {this.state.InvitedFiles.length!=0 ?
                            <div>
                                <h3 style={{marginLeft:'35px',marginTop:'10px'}}>Invited Files</h3>
                                <div className="grid_css">
                                    {this.state.InvitedFiles}
                                </div>
                            </div> : ''
                        }
                        {this.state.Workspaces.length!=0 ?
                            <div>
                                <h3 style={{marginLeft:'35px',marginTop:'10px'}}>Workspaces</h3>
                                <div className="grid_css">
                                    {this.state.Workspaces}
                                </div>
                            </div> : ''
                        }
                        </div> 
                );
            } // end of modal open ie., signup 
        } // end of readRequest if else  
        } // end of loading if else
    }
}

export default Drive;