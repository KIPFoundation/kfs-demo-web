import React, { Component } from 'react';
import {Header,Image,Table,Icon,Button,Popup} from 'semantic-ui-react';
import web3 from '../miscellaneous/web3';
import KIP_LOGO from '../assets/logo_without-title.png';
import '../assets/css/contentView.css';
import axios from 'axios';
import RightPaneComponent from './rightPaneComponents';
import AccountOptions from './accountOptions';
import Options from './FileOptions';
import CustomIFrame from './CustomIFrame';

class ContentView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      b64OfSender:'',
      filesWithJSX:[],
      fetchFileContentAction:false,
      openedFileName:'',
      source:KIP_LOGO,
      pathTraversal:[],
      fileToBeRead:''
    }
  }
  
  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    this.setState({ b64OfSender:window.btoa(accounts[0].toLowerCase()) });
    this.keepDelayInrender();
  }

  componentWillReceiveProps(newProps) {
    // Loading new data when the content property changes.
    if (newProps.content !== this.props.content) {      
      this.keepDelayInrender();
    }
  }


  keepDelayInrender = () => {
    this.setState({filesWithJSX:<FakeContent />})
    setTimeout(() => {
      this.setState({pathTraversal:['KFS Drive'],filesWithJSX : this.renderFiles(this.props.content) });
    }, 1000);  
  }
  
  fetchFilesOfFolder = (folderAttributes,typeNumber) => {
    this.setState({filesWithJSX:<FakeContent />});
    let url;
    if(typeNumber === 2) {
      url = 'http://204.48.21.88:3000/readfolder/'+folderAttributes.fileID+'?reciPub='+this.state.b64OfSender;
    }
    else {
      url = 'http://204.48.21.88:3000/appdata/'+folderAttributes.fileID+'?reciPub='+this.state.b64OfSender; 
    }
    console.log(url)
    axios({
      method:'get',
      url: url,
      auth: {
          username: 'sai',
          password: '123'
      }
    })
    .then( response => {
        let innerFiles = response.data.files;
        innerFiles !== null ? innerFiles.map(fileObject => fileObject['is_root_file'] = 'true') : console.log('File is empty');
        let tempPathTraversal = this.state.pathTraversal;
        tempPathTraversal.push(folderAttributes.smallFN);
        this.setState({filesWithJSX : this.renderFiles(innerFiles) , pathTraversal : tempPathTraversal });
    })
    .catch(error => {
        console.log(error);
    });      
  }

  renderFiles = filesnFolders => {
    console.log(filesnFolders);
    let filesWithJSX = [];
    if(filesnFolders === null) {
      filesWithJSX.push(
        <React.Fragment>
          <Table.Row key="fake1"><Table.Cell style={{padding:'3%'}}/><Table.Cell /><Table.Cell /></Table.Row>
          <Table.Row key="fake2"><Table.Cell style={{padding:'3%'}}/><Table.Cell /><Table.Cell /></Table.Row>
          <Table.Row key={'No Files'}>
              <Table.Cell />
              <Table.Cell style={{padding:'3% 3% 3% 20%'}}>
                No Files Found
              </Table.Cell>
            <Table.Cell />
          </Table.Row>
          <Table.Row><Table.Cell style={{padding:'3%'}}/><Table.Cell /><Table.Cell /></Table.Row>
          <Table.Row><Table.Cell style={{padding:'3%'}}/><Table.Cell /><Table.Cell /></Table.Row>
        </React.Fragment>
      )
    }
    else {
      filesWithJSX = filesnFolders.map((file,index) => {
        if(file.is_root_file === "true") {
          if(file.file_name !== undefined) {
            const fileName = file.file_name;
            const indexOfExtension = fileName.lastIndexOf('.');
            const extension = fileName.substr(indexOfExtension+1,fileName.length);
            let file_icon;
            if(extension === 'jpeg' || extension === 'png' || extension === 'gif' || extension === 'jpg') {
              file_icon = "file image outline";
            } 
            else if(extension === 'mp4' || extension === 'quicktime' || extension === 'x-flv' || extension === 'x-msvideo' || extension === 'x-matroska') {
              file_icon = "file video outline";
            }
            else if(extension === 'pdf') {
              file_icon = "file pdf outline"
            }
            else 
              file_icon = "file outline"
            return (
                <Table.Row key={file.file_hash} className="fileList">
                    <Table.Cell>
                      <Icon  color="blue" name={file_icon} size="large"/>
                    </Table.Cell>
                    <Table.Cell onClick={() => 
                        this.setState({ fetchFileContentAction:true,openedFileName:fileName,fileToBeRead:file.file_hash }) 
                      }>
                      <span className="file_name_css">{fileName}</span>
                    </Table.Cell>
                    <Table.Cell>
                      {extension}
                    </Table.Cell>
                  <Table.Cell className="options-menu">
                  <Popup style={{width:'40%'}}
                    trigger={<Button style={{backgroundColor:'transparent',padding:'8% 12% 8% 12%'}} size="huge" icon='ellipsis horizontal' />}
                    content = {<Options fileAttributes = {file} {...this.state}/>}
                    on='click'
                    position='bottom right'
                  />
                  </Table.Cell>
                </Table.Row>
              )
          }
          else if(file.folder_name !== undefined) {
            const folderName = file.folder_name;
            const separatorIndex = folderName.indexOf("_$2a");
            const actualFolderName = folderName.substring(0,separatorIndex);
            return (
                <Table.Row key={file.folder_hash} className="fileList">
                    <Table.Cell>
                      <Icon color="blue" name="folder outline" size="big"/>
                    </Table.Cell>
                    <Table.Cell onClick={() => this.fetchFilesOfFolder({
                        fileID : file.folder_hash,
                        smallFN : actualFolderName,
                        hugeFN : folderName
                      },2)}>
                      <span className="file_name_css">{actualFolderName}</span>
                    </Table.Cell>
                    <Table.Cell>
                      {"folder"}
                    </Table.Cell>
                    <Table.Cell className="options-menu">
                  <Popup style={{width:'40%'}}
                    trigger={<Button style={{backgroundColor:'transparent',padding:'8% 12% 8% 12%'}} size="huge" icon='ellipsis horizontal' />}
                    content = {<Options fileAttributes = {file} {...this.state}/>}
                    on='click'
                    position='bottom right'
                  />
                  </Table.Cell>
                </Table.Row>
              )
          }
          else if(file.app_name !== undefined) {
            return (
              <Table.Row key={file.app_hash} className="fileList">
                  <Table.Cell>
                    <Icon color="blue" name="folder outline" size="big"/>
                  </Table.Cell>
                  <Table.Cell onClick={() => this.fetchFilesOfFolder({
                        fileID : file.app_hash,
                        smallFN : file.app_name,
                        hugeFN : file.app_name
                      },1)}>
                    <span className="file_name_css">{file.app_name}</span>
                  </Table.Cell>
                  <Table.Cell>
                    {"folder"}
                  </Table.Cell>
                  <Table.Cell className="options-menu">
                <Popup style={{width:'40%'}}
                  trigger={<Button style={{backgroundColor:'transparent',padding:'8% 12% 8% 12%'}} size="huge" icon='ellipsis horizontal' />}
                  content = {<Options fileAttributes = {file} {...this.state}/>}
                  on='click'
                  position='bottom right'
                />
                </Table.Cell>
              </Table.Row>
            )
          }
        }
      });
    }
    const tableBody = (<Table.Body>{filesWithJSX}</Table.Body>);
    return tableBody;
  }

  render() {
    return (
      <React.Fragment>
        <div style={{display:'flex'}}>
          <div style={{display:'flex',width:'80%',flexDirection:'column'}}>
            <div style={{display:'flex'}}>
              <div style={{padding:'6% 5% 2% 10%',width:'100%'}}>
                <PathTraversal 
                  path={this.state.pathTraversal} 
                  homeCall = {() => this.props.refreshDrive()} />
              </div>
              {/* <div className="normal-search-box">
                  <Input style={{ width: "100%"}} iconPosition = "left" icon='search' placeholder='Search by Mutlihash' transparent/>
              </div> */}
            </div> 
            <div style={{width:'100%'}} className="table_body_scrollable">
              <Table basic="very" compact padded className="content-container">
                  <Table.Header className="stick-t_head">
                    <Table.Row>
                      <Table.HeaderCell style={{width:'5%'}}>
                        Name
                      </Table.HeaderCell>
                      <Table.HeaderCell style={{width:'55%'}}>
                      </Table.HeaderCell>
                      <Table.HeaderCell style={{width:'20%'}}>
                        Type
                      </Table.HeaderCell>
                      <Table.HeaderCell style={{width:'20%'} }>
                        Options
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  {this.state.filesWithJSX}
              </Table>
            </div>
          </div>
          <div className="right_pane">
            <div style={{width:'20%'}} className="accountOptions">
                <AccountOptions />
            </div>
            <RightPaneComponent 
                refreshDrive = {() => this.props.refreshDrive()}
            />
          </div>
        </div>
        {this.state.fetchFileContentAction? 
          <div className="modal">
              <div className="modal-content">
                <Header color="teal" as='h2'>
                  <Icon.Group size='large'>
                    <Icon name='file' />
                    <Icon color="blue" corner name='eye' />
                  </Icon.Group>
                   <span style={{marginLeft:'2%'}}>{this.state.openedFileName}</span>
                  <span onClick={() => this.setState({fetchFileContentAction:false,source:KIP_LOGO})} className="close">&times;</span>
                </Header>
                  {this.state.fileToBeRead !==  '' ? 
                    <center style={{marginTop:'10%',marginLeft:'25%',width:'60%',height:'60%'}} >
                        <CustomIFrame kfsFileID={this.state.fileToBeRead} 
                          user = {this.state.b64OfSender} 
                          fileName = {this.state.openedFileName}
                        />
                    </center>
                    : ''}
                  }
              </div>
          </div>
      : ''}
      </React.Fragment>
    );
  }
}

export default ContentView;

class PathTraversal extends Component {
  render() {
    const tail = this.props.path.length-1;
    return (
      <div style={{display:'flex'}}>
      { this.props.path.map((folder,index) => {
        return ( 
            <div key={index} className={tail === index ? "folder-active" : "folder-inactive"}>
              <div style={{fontSize:'24px'}} onClick={() => {
                if(index === 0) {
                  this.props.homeCall()
                }
              }}>{folder}</div>
              {tail !== index ? <Icon style={{marginTop:'2%'}} size="large" name="caret right" /> : ''}
            </div>
        )
      }) }
      </div>
    )
  }
}

class FakeContent extends Component {
  render() {
    return (
      <Table.Body className="fake-content">
        <Table.Row>
          <Table.Cell><div className="fake-column"></div></Table.Cell>
          <Table.Cell><div className="fake-column"></div></Table.Cell>
          <Table.Cell><div className="fake-column"></div></Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell><div className="fake-column"></div></Table.Cell>
          <Table.Cell><div className="fake-column"></div></Table.Cell>
          <Table.Cell><div className="fake-column"></div></Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell><div className="fake-column"></div></Table.Cell>
          <Table.Cell><div className="fake-column"></div></Table.Cell>
          <Table.Cell><div className="fake-column"></div></Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell><div className="fake-column"></div></Table.Cell>
          <Table.Cell><div className="fake-column"></div></Table.Cell>
          <Table.Cell><div className="fake-column"></div></Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell><div className="fake-column"></div></Table.Cell>
          <Table.Cell><div className="fake-column"></div></Table.Cell>
          <Table.Cell><div className="fake-column"></div></Table.Cell>
        </Table.Row>
      </Table.Body>
    );
  }
}