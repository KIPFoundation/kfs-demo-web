import React from 'react';
// import ExplorerView from './explorerView';
import { Icon,Modal,Header,Button,Image } from 'semantic-ui-react';
import web3 from './ethereum/web3.js';
import axios from 'axios';
import loadingGIF from './loader.gif';
// import ReactPlayer from 'react-player';
import kfs from './ethereum/kfs.js'


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
            source:'',
            videoContent:false,
            VideoSource:'',
            videoType:'',
            openWorkspace:'',
            siteMap:'',
            fileLoading:false,
            backAction:'',
            openWorkspaceAction:false
        }
    }

    async componentDidMount() {
        this.setState({ loading:true });
        const accounts = await web3.eth.getAccounts();
        const b64Sender = window.btoa(accounts[0].toLowerCase());
        this.setState({sender : accounts[0]});
        /* we can uncomment below statement once route is fixed to allow user signup if not exists */ 
        // this.letTosignUpOrRenderDrive(b64Sender);
        this.fetchSitemap(b64Sender, b64Sender);
    }

    renderDrive = (explorer) => {
            // this.setState({ readRequest:false })
            this.renderAppContents(explorer);
            // this.renderWorkspaces();    
    }



    fetchSitemap = (appName, senderPub) => {
        const fetchingSiteMapURL = 'http://204.48.21.88:3000/explorer?AppName='+appName+'&senderPub='+senderPub;
        axios.get(fetchingSiteMapURL)
        .then( response => {
            if(response.data){
               if(appName == senderPub){
                    this.setState({siteMap: response.data});
                }
                this.renderDrive(response.data);
            }
        })
        .catch(error => {
            console.log('Error in Fetching SiteMap --> ' + error);
        });
    }

    fetchSitemapOfWorkspace = (appName) => {
        const desiredWorkspace = web3.utils.hexToAscii(appName).replace(/\u0000/g, '')
        console.log(desiredWorkspace.length);
        const owner = window.btoa(this.state.sender.toLowerCase());
        const url = 'http://204.48.21.88:3000/appdata/'+desiredWorkspace+'?senderPub='+owner+'&reciPub='+owner;
        console.log(url);
        axios.get(url)
        .then( response => {
            const innerFiles = response.data.files;
            console.log(innerFiles);
            let innerContents = [];
                for(let innerFile of innerFiles) {
                    innerContents.push( (<button className="card" 
                                                onClick={() => this.renderFile(innerFile.file_hash, 'self',[],innerFile.file_name,2)}>
                                                    <Icon name='file' />
                                                    <span>{innerFile.file_name}</span>
                                                </button>) );
                }
            this.setState({openWorkspace:desiredWorkspace,openWorkspaceAction:true,readRequest:true,workspaceInnerContents:innerContents})
        })
        .catch(error => {
            console.log(error);
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

    renderFile = (fileToBeRead, receipentAddress, appHistory,fileName,iteration) => {
        this.setState({readRequest:true,appHistory:appHistory,source:'',VideoSource:'',fileLoading:true,openWorkspaceAction:false});
        const b64OfSender = window.btoa(this.state.sender.toLowerCase());
        // Check this for rendering of files
        const b64OfReceipent = receipentAddress == 'self' ? b64OfSender : receipentAddress;
        const readingUrl = 'http://204.48.21.88:3000/read/'+fileToBeRead+'?reciPub=' + b64OfReceipent;
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
                link.setAttribute('download', fileName); //or any other extension
                document.body.appendChild(link);
                link.click();
                this.setState({readRequest : false});
            }
            else {
                const url = window.URL.createObjectURL(new Blob([readingUrl]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName); //or any other extension
                document.body.appendChild(link);
                link.click();
                this.setState({readRequest : false});
            }
          }
        })
        .catch((error) => {
          console.log(error);
      });
        this.setState({loading:false,backAction:iteration}); //remove this afterwards
    }

    renderAppContents = async (siteMap) => {
        let tempInvitedFiles = [];
        let tempCreatedFiles = [];
        if(siteMap){
        for(let invitedFile of siteMap.InvitedFiles) {
            tempInvitedFiles.push( (<button className="card" 
                                        onClick={() => this.renderFile(invitedFile.file_hash, 'self', siteMap.app_name,invitedFile.file_name,1)}>
                                            <Icon name='file' />
                                            <span>{invitedFile.file_name}</span>
                                        </button>) );
        }
         if(siteMap.CreatedFiles){
        for(let createdFile of siteMap.CreatedFiles) {
            tempCreatedFiles.push( (<button className="card" 
                                        onClick={() => this.renderFile(createdFile.file_hash, createdFile.receiver_pub, siteMap.app_name,createdFile.file_name,1)}>
                                            <Icon name='file' />
                                            <span>{createdFile.file_name}</span>
                                        </button>) );
        }
    }
        // let currentWorkspace = siteMap.app_name;
        this.setState({ openWorkspaceAction:false,readRequest:false, Workspaces:[] , InvitedFiles:tempInvitedFiles, CreatedFiles:tempCreatedFiles, open:false, loading:false})
    }}

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
            // The second param in the fetchSitemap function should be the senderPub (in base64 encoded format) 
            const currentAppName = web3.utils.hexToUtf8(workspace.appName)
            tempWorkspaces.push( (<button className="card" 
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

    loadingComponent = () => {
        return (
            <div style={{padding:'5% 10% 10% 15%'}}>
                <center>
                <img height="150px" width="150px;" style={{marginTop : '100px'}} src={ loadingGIF } />
                </center>
            </div>
        );
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

        

        const header = (
            <div style={{display:'flex'}}>
                <span style={{marginRight:'650px'}}>MY KFS DRIVE</span>
                <Button onClick={() => window.location = "/create"} icon labelPosition='right'>
                    Create Workspace
                 <Icon name='plus' />
                </Button>
            </div>
        );
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
                            if(this.state.backAction == 2) {
                                this.setState({openWorkspaceAction:true,backAction:1});
                            }
                            else {
                                this.renderDrive(this.state.siteMap)}
                            }   
                        }>
                               BACK
                     <Icon name='left arrow' style={{float: 'left'}}/>
                    </Button>
                    {this.state.openWorkspaceAction ? 
                    <div style={{backgroundColor:'white',padding:'5% 10% 10% 15%'}}>
                    <div style={{fontSize:'24px',marginLeft:'30px',display:'flex'}}>{this.state.openWorkspace}</div>
                    <hr />
                         <h3 style={{marginLeft:'35px',marginTop:'10px'}}>Files</h3>
                        <div className="grid_css">
                            {this.state.workspaceInnerContents}
                        </div>
                    </div>
                    :
                    <div style={{backgroundColor:'#e6e6e6',height:'700px',border:'1px solid #',width:'80%',padding:'5%',margin:'5% 10% 5% 12%'}}>
                        {this.state.imageContent ? <Image style={{width:'50%'}} src={this.state.source} /> : ''}
                    </div> }
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
                    <div style={{backgroundColor:'white',padding:'5% 10% 10% 15%',height:'750px',overflow: 'auto'}}>
                    <div style={{fontSize:'24px',marginLeft:'30px',display:'flex'}}>{'MY KFS DRIVE'}</div>
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
                        {/* {this.state.Workspaces.length!=0 ?
                            <div>
                                <h3 style={{marginLeft:'35px',marginTop:'10px'}}>Workspaces</h3>
                                <div className="grid_css">
                                    {this.state.Workspaces}
                                </div>
                            </div> : ''
                        } */}
                        </div> 
                );
            } // end of modal open ie., signup 
        } // end of readRequest if else  
        } // end of loading if else
    }
}

export default Drive;