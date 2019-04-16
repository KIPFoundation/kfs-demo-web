import React,{Component} from 'react';
import {List,Icon,Button,Header} from 'semantic-ui-react';
import axios from 'axios';
import '../assets/css/fileOptions.css';
class Options extends Component {
    constructor(props) {
      super(props);
      this.state = {
        fileGettingRemoved : '',
        modalOpen:false,
        removeObject:'',
        removeProcessing:false,
        fileAttributes:{},
        folderAttributes:{}
      }
    }
    componentDidMount() {
      this.setState({fileAttributes : this.props.fileAttributes,folderAttributes : this.props.parentProperties()});
    }
    componentWillReceiveProps(newProps) {
      // Loading new data when the content property changes.
      if(this.props.parentProperties() !== newProps.parentProperties()) {
          this.setState({fileAttributes : newProps.fileAttributes,folderAttributes : newProps.parentProperties()});
      }
    }
    removeFile = () => {
      let driveRefreshBoolean = false;
      const fileAttributes = this.state.fileAttributes;
      const folderAttributes = this.state.folderAttributes;
      this.setState({removeProcessing:true});
      let removeURL = '';
      if(fileAttributes.file_name !== undefined) {
        if(folderAttributes.type === 1) {
          removeURL = 'http://35.200.183.53:3000/Remove?'+
          'appName='+folderAttributes.kfsName+
          '&senderPub='+this.props.user+
          '&name='+fileAttributes.file_name+
          '&hash='+fileAttributes.file_hash+
          '&type=file'
        }
        else if(folderAttributes.type === 2) {
          removeURL = 'http://35.200.183.53:3000/RemoveFileFolder?'+
          'appName='+folderAttributes.kfsName+
          '&senderPub='+this.props.user+
          '&name='+fileAttributes.file_name+
          '&hash='+fileAttributes.file_hash+
          '&type=file'
        }
        else {
          driveRefreshBoolean = true;
          removeURL = 'http://35.200.183.53:3000/Remove?'+
          '&senderPub='+this.props.user+
          '&name='+fileAttributes.file_name+
          '&hash='+fileAttributes.file_hash+
          '&type=file'
        }
        axios({
          method:'get',
          url: removeURL,
          auth: {
              username : 'qwerty',
              password: '123456'
          }
        })
        .then( response => {
          if(response.data === 'Permission denied') {
            this.setState({removeObject : {
              status : true,
              message : 'Permission denied...!',
              color:'red',
              appIdAttempt:driveRefreshBoolean,
            },removeProcessing:false})
          }
          else {
            this.setState({removeObject : {
              status : true,
              message : 'File/Folder removed !',
              color:'green',
              appIdAttempt:driveRefreshBoolean,              
            },removeProcessing:false})
          }
        })
        .catch(error => {
            console.log(error);
            this.setState({removeObject : {
              status : true,
              message : 'Error in removing / file got removed but error in unpinning',
              color:'red',
              appIdAttempt:driveRefreshBoolean,              
            },removeProcessing:false})
        });  
      }
      else if(fileAttributes.folder_name !== undefined) {
        if(folderAttributes.type === 1) {
          removeURL = 'http://35.200.183.53:3000/Remove?'+
          'appName='+folderAttributes.kfsName+
          '&senderPub='+this.props.user+
          '&name='+fileAttributes.folder_name+
          '&hash='+fileAttributes.folder_hash+
          '&type=folder'
        }
        else if(folderAttributes.type === 2) {
          removeURL = 'http://35.200.183.53:3000/RemoveFileFolder?'+
          'appName='+folderAttributes.kfsName+
          '&senderPub='+this.props.user+
          '&name='+fileAttributes.folder_name+
          '&hash='+fileAttributes.folder_hash+
          '&type=folder'
        }
        else {
          driveRefreshBoolean = true;
          removeURL = 'http://35.200.183.53:3000/Remove?'+
          '&senderPub='+this.props.user+
          '&name='+fileAttributes.folder_name+
          '&hash='+fileAttributes.folder_hash+
          '&type=folder'
        }
        console.log(removeURL);
        axios({
          method:'get',
          url: removeURL,
          auth: {
              username : 'qwerty',
              password: '123456'
          }
        })
        .then( response => {
          if(response.data === 'Permission denied') {
            this.setState({removeObject : {
              status : true,
              message : 'Permission denied...!',
              color:'red',
              appIdAttempt:driveRefreshBoolean,              
            },removeProcessing:false})
          }
          else {
            this.setState({removeObject : {
              status : true,
              message : 'File/Folder removed !',
              color:'green',
              appIdAttempt:driveRefreshBoolean,              
            },removeProcessing:false})
          }
        })
        .catch(error => {
            console.log(error);
            this.setState({removeObject : {
              status : true,
              message : 'Error in removing / file got removed but error in unpinning',
              color:'red',
              appIdAttempt:driveRefreshBoolean,              
            },removeProcessing:false})
        });  
      }
      else {
        this.setState({removeObject : {
          status : true,
          message : "You cannot remove a shared folder!",
          color:'blue',
          appIdAttempt:true,          
        },removeProcessing:false})
      }
    }

    render() {
      let fileGettingRemoved = this.props.fileAttributes.file_name || this.props.fileAttributes.folder_name || this.props.fileAttributes.app_name;;
      const separatorIndex = fileGettingRemoved.indexOf("_$2a");
      const actualFolderName = separatorIndex === -1 ? fileGettingRemoved : fileGettingRemoved.substring(0,separatorIndex);
      return (
        <React.Fragment>
            <List className={this.state.modalOpen ? "dontShow" : ""} divided verticalAlign='middle'>
                <List.Item style={{padding:'7%',cursor:'pointer'}}
                  onClick={() => {
                    this.setState({modalOpen : true,fileGettingRemoved:actualFolderName}) 
                  }}>
                  <Icon name="trash" size="large"/>
                    <List.Content>
                      <List.Header style={{fontSize:'16px',marginTop:'1%'}} as='a'>Delete</List.Header>
                    </List.Content>
                </List.Item>
            </List>
            <div className={this.state.modalOpen && !this.state.removeObject.status? "remove_container" : "dontShow"}>                
                <Header size="medium">{'Are you sure you want to remove file/folder : '+this.state.fileGettingRemoved}</Header>
                <div style={{display:'flex',marginLeft:'50%'}}>
                    <Button style={{marginRight:'20px'}} basic color='red' size="large" content='No' 
                      onClick={()=>this.setState({modalOpen:false})} disabled={this.state.removeProcessing}/>
                    <Button loading={this.state.removeProcessing} basic color='green' size="large" content='Yes' 
                      onClick={()=> this.removeFile()} /> 
                </div>  
            </div>
            <div className={this.state.modalOpen && this.state.removeObject.status ? "remove_container" : "dontShow"}>                
                <Header color={this.state.removeObject.color} size="medium">{this.state.removeObject.message}</Header> 
                <Button onClick={()=>{
                  this.setState({modalOpen:false});
                  console.log(this.state.removeObject.appIdAttempt);
                  if(this.state.removeObject.appIdAttempt) {
                    this.props.refreshExplorer(this.state.folderAttributes)
                  }
                  else {
                    this.props.refreshOpenedFolder(this.state.folderAttributes)}
                  }
                 } color="blue" size="large" basic>Ok</Button>
            </div>
        </React.Fragment>
      );
    }
  }
export default Options;
