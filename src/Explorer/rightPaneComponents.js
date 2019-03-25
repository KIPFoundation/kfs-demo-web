import React from 'react';
import "../assets/css/rightComponent.css";
import {Label,Icon,Card,Input,Button,Popup, Dropdown} from 'semantic-ui-react';
import axios from 'axios';
class RightPaneComponent extends React.Component {
    state = {
        isCreateSharedFolderClicked:true,
        isOpen:false,
        creatingFolder:false,
        folderName:'',
        responseInCreatingFolder:'',
        buttonAcknowledgement:'Create',
        uploadnShareAction:'off',
        fileSelected:'',
        selectApp:'',
        receipent:''
    }
    createSharedFolderAction = () => {
        if(this.state.buttonAcknowledgement === 'Done') {
            this.setState({responseInCreatingFolder:'',isOpen:false,buttonAcknowledgement:'Create',creatingFolder:false});
            window.location.href = "/home";
        }
        this.setState({creatingFolder:true});
        const appIdUrl = 'http://204.48.21.88:3000/createAppID/'+this.state.folderName.trim()+'?sender='+this.props.user;
        console.log(appIdUrl);    
        axios.get(appIdUrl)
        .then( response => {
            this.setState({creatingFolder:false,buttonAcknowledgement:'Done',responseInCreatingFolder:'Folder with name '+this.state.folderName+' created successfully'});
        })
        .catch(error => {
            console.log(error);
            this.setState({creatingFolder:false,responseInCreatingFolder:'Error in creating folder'});
        });
    }
    uploadFolderHandler = (event) => {
        console.log(event.target.files);
        // const formData = new FormData();
        // formData.append('files', event.target.files);
        // axios.post('http://192.168.16.228:3000/up', formData)
        // .then( response => {
        //     console.log(response);
        // })
        // .catch(error => {
        //   console.log(error)
        // });
    }
    uploadnUpdate = () => {
        this.setState({uploadnShareAction:'on'});
        const formData = new FormData();
        // if(this.state.selectApp === "Drive" )
        formData.append('file', this.state.fileSelected);
        formData.append('appName', this.state.selectApp.trim());
        formData.append('senderPub', this.props.user);
        formData.append('reciPub', window.btoa(this.state.receipent.toLowerCase()));
        axios.post('http://204.48.21.88:3000/upload/update', formData)
        .then( response => {
          if(response.data === 'false') {
            this.setState({hashMessage:'UnAuthorized Attempt',visible:true,alert:'KFS Alert'})
          }
          else {
            this.setState({uploadnShareAction:'off'});
            console.log('Done');
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
    
    render() {
        return (
            <div style={{marginTop:'20%',paddingLeft:'10%'}}>
                <div className="file-input-wrapper">
                    <div className="btn-file-input">
                        <Icon size="large" name='upload' />
                        <div style={{margin:'0% 0px 0px 2.7%'}}>Upload File</div>
                    </div>
                    <input type="file" name="file" 
                        onChange={(event) => this.props.uploadFileHandler(event.target.files[0])} />
                </div>
                <Popup style={{padding:'0px'}}
                    trigger = {
                        <div className={this.state.isOpen? "new-shared-folder-clicked" : "new-shared-folder"}>
                                <Icon size="large" name='add' />
                                <div style={{margin:'0% 0px 0px 2.7%'}}>New Folder</div>
                        </div>
                    }
                    content={
                    <Card style={{padding:'3%'}}>
                        <Card.Content>
                            <Card.Header style={{cursor:'pointer',float:'right',fontSize:'24px'}} onClick={() => this.setState({isOpen:false,responseInCreatingFolder:'',buttonAcknowledgement:'Create',creatingFolder:false}) }>&times;</Card.Header>
                            <Card.Header>New Folder</Card.Header>
                            </Card.Content>
                        <Card.Content>
                        <Input style={{width:'100%'}} placeholder="Enter name"
                            onChange={(e) => this.setState({folderName:e.target.value})} />
                        <p className={
                                this.state.responseInCreatingFolder !== '' ?
                                this.state.responseInCreatingFolder !== "Error in creating folder" ? "positive-response" :"negative-response"
                                :"dontShow"
                            }>
                            {this.state.responseInCreatingFolder}
                        </p>
                        <Button loading={this.state.creatingFolder} 
                            onClick={() => this.createSharedFolderAction()}
                            style={{margin:'4% 0% 0% 30%'}} primary>{this.state.buttonAcknowledgement}
                        </Button> 
                        </Card.Content>
                    </Card>
                    }
                    on='click'
                    open={this.state.isOpen}
                    onOpen={() => this.setState({ isOpen: true })}
                    position='left center'
                />
                
                <div className="file-input-wrapper">
                    <div className="btn-file-input">
                        <Icon size="large" name='folder' />
                        <div style={{margin:'0% 0px 0px 2.7%'}}>Upload Folder</div>
                    </div>
                    <input directory="" webkitdirectory="" type="file" onChange={(e) => this.uploadFolderHandler(e)} />                     
                </div>
                 <div className={this.state.uploadnShareAction !== 'off' ? "modal-for-uploading" : "dontShow"}>
                    <center>
                    <div className="upload-n-share">
                        <div className={this.state.uploadnShareAction === "on" ? "lesser-brighter":""} style={{borderBottom:'0.3px solid #a6a6a6',paddingBottom:'1%'}}>
                            <div style={{cursor:'pointer',float:'left'}}>{this.state.fileSelected.name}</div>
                            <div 
                                style={{cursor:'pointer',float:'right',fontSize:'24px'}}
                                onClick={()=>this.setState({uploadnShareAction:"off"})}>&times;
                            </div>
                        </div>
                        <div className={this.state.uploadnShareAction === "on" ? "sharing-bar":"dontShow"}></div>
                        <div className={this.state.uploadnShareAction === "on" ? "lesser-brighter":""} style={{display:'flex',margin:'2% 0% 2% 0%'}}>
                            <Label style={{fontSize:'12px',width:'10%',backgroundColor:'transparent'}}>To:</Label>
                            <Input style={{width:'90%',border:'1px'}}  
                                    placeholder='Enter address' transparent
                                    onChange={(event) => this.setState({receipent:event.target.value})} /> 
                        </div>
                        <div  className={this.state.uploadnShareAction === "on" ? "lesser-brighter":""} style={{display:'flex',margin:'2% 0% 2% 0%'}}>
                            <Label style={{fontSize:'12px',width:'20%',marginLeft:'-5px',backgroundColor:'transparent'}}>Move to:</Label>
                            <Dropdown style={{width:'80%',fontSize:'12px'}} placeholder="Select Folder" 
                                onChange={ (e,data) => this.setState({selectApp: data.value})}
                                fluid selection options={this.props.foldersOwned} />
                        </div>
                        <Button loading={this.state.creatingFolder} 
                            className={this.state.uploadnShareAction === "on" ? "lesser-brighter":""}
                            onClick={() => this.uploadnUpdate()}
                            style={{fontSize:'12px',margin:'2% 0% 0% 4%'}} primary>Share
                        </Button>
                    </div> 
                    </center>
                </div>
            </div>
        )
    }
}
export default RightPaneComponent;