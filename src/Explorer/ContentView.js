import React, { Component } from 'react';
import {Header,Table,Icon,Button,Popup} from 'semantic-ui-react';
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
      fileToBeRead:'',
      currentFolderProperties:{},
      // closeOptions:'yes'
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
  special = () => {
    return this.state.currentFolderProperties;
  }

  keepDelayInrender = () => {
    this.setState({filesWithJSX:<FakeContent />})
    setTimeout(() => {
      this.setState({
        pathTraversal:[{name : 'KFS Drive',kfsName:'none'}],
        currentFolderProperties : {name : 'explorer',type:0},
        filesWithJSX : this.renderFiles(this.props.content) });
    }, 1000);  
  }
  
  fetchFilesOfFolder = (folderAttributes,pathRequest) => {
    /* slicing path if path requests */
    if(pathRequest) {
      let path = this.state.pathTraversal;
      const slicerIndex = path.indexOf(folderAttributes);
      path = path.slice(0,slicerIndex+1);
      this.setState({pathTraversal : path});
    }
    /* end */
    this.setState({filesWithJSX:<FakeContent />});
    let typeNumber = folderAttributes.type;
    let url;
    if(typeNumber === 2) {
      url = 'http://35.200.183.53:3000/readfolder/'+folderAttributes.kfsID+'?reciPub='+this.state.b64OfSender;
    }
    else {
      url = 'http://35.200.183.53:3000/appdata/'+folderAttributes.kfsID+'?reciPub='+this.state.b64OfSender; 
    }
    axios({
      method:'get',
      url: url,
      auth: {
          username : 'qwerty',
          password: '123456'
      }
    })
    .then( response => {
        let innerFiles = response.data.files;
        innerFiles !== null ? innerFiles.map(fileObject => fileObject['is_root_file'] = 'true') : console.log('Folder is empty');
        let tempPathTraversal = this.state.pathTraversal;
        if(!pathRequest) tempPathTraversal.push(folderAttributes);
        this.setState({filesWithJSX : this.renderFiles(innerFiles) , currentFolderProperties : folderAttributes , pathTraversal : tempPathTraversal });
    })
    .catch(error => {
        console.log(url)
        console.log(error);
        this.setState({filesWithJSX : []})
    });      
  }

  renderFiles = filesnFolders => {
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
            else if(extension === 'js' || extension === 'html' || extension === 'go') {
              file_icon = 'file code outline'
            }
            else if(extension === 'txt' || extension === 'md' || extension === 'json') {
              file_icon = 'file text'
            }
            else {
              file_icon = "file alternate outline"
            }
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
                    trigger={<Button style={{backgroundColor:'transparent',padding:'8% 12% 8% 12%'}} size="huge" icon='ellipsis horizontal' 
                      onClick={()=>this.setState({closeOptions : 'no'})}/>}
                      content = {<Options 
                        fileAttributes = {file} 
                        parentProperties={() => this.special()}
                        user = {this.state.b64OfSender}
                        refreshOpenedFolder = {(folderAttributes)=> this.fetchFilesOfFolder(folderAttributes,true)}
                        refreshExplorer = {() => this.props.refreshDrive()}                        
                      />
                    }
                    on='click'
                    // open={this.state.closeOptions === 'no' ? true : false}
                    position='bottom right'
                  />
                  </Table.Cell>
                </Table.Row>
              )
          }
          else if(file.folder_name !== undefined) {
            const folderName = file.folder_name;
            const separatorIndex = folderName.indexOf("_$2a");
            const actualFolderName = separatorIndex === -1 ? folderName : folderName.substring(0,separatorIndex);
            return (
                <Table.Row key={file.folder_hash} className="fileList">
                    <Table.Cell>
                      <Icon color="blue" name="folder outline" size="big"/>
                    </Table.Cell>
                    <Table.Cell onClick={() => this.fetchFilesOfFolder({
                        name : actualFolderName,
                        kfsName : file.folder_name,
                        kfsID : file.folder_hash,
                        type:2
                      },false)}>
                      <span className="file_name_css">{actualFolderName}</span>
                    </Table.Cell>
                    <Table.Cell>
                      {"folder"}
                    </Table.Cell>
                    <Table.Cell className="options-menu">
                  <Popup style={{width:'40%'}}
                    trigger={<Button style={{backgroundColor:'transparent',padding:'8% 12% 8% 12%'}} size="huge" icon='ellipsis horizontal' />}
                    content = {<Options 
                        fileAttributes = {file} 
                        parentProperties={() => this.special()}                        
                        user = {this.state.b64OfSender}
                        refreshOpenedFolder = {(folderAttributes)=> this.fetchFilesOfFolder(folderAttributes,true)}
                        refreshExplorer = {() => this.props.refreshDrive()}
                      />
                    }
                    on='click'
                    position='bottom right'
                  />
                  </Table.Cell>
                </Table.Row>
              )
          }
          else if(file.app_name !== undefined) {
            const folderName = file.app_name;
            const separatorIndex = folderName.indexOf("_$2a");
            const actualFolderName = separatorIndex === -1 ? folderName : folderName.substring(0,separatorIndex);
            return (
              <Table.Row key={file.app_hash} className="fileList">
                  <Table.Cell>
                    <Icon color="blue" name="folder outline" size="big"/>
                  </Table.Cell>
                  <Table.Cell onClick={() => this.fetchFilesOfFolder({
                        name : actualFolderName,
                        kfsName : file.app_name,
                        kfsID : file.app_hash,
                        type:1
                      },false)}>
                    <span className="file_name_css">{actualFolderName}</span>
                  </Table.Cell>
                  <Table.Cell>
                    {"folder"}
                  </Table.Cell>
                  <Table.Cell className="options-menu">
                <Popup style={{width:'40%'}}
                  trigger={<Button style={{backgroundColor:'transparent',padding:'8% 12% 8% 12%'}} size="huge" icon='ellipsis horizontal' />}
                  content = {<Options 
                      fileAttributes = {file} 
                      parentProperties={() => this.special()}                      
                      user = {this.state.b64OfSender}
                      refreshOpenedFolder = {(folderAttributes)=> this.fetchFilesOfFolder(folderAttributes,true)}
                      refreshExplorer = {() => this.props.refreshDrive()}
                    />
                  }
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
                  homeCall = {() => this.props.refreshDrive()} 
                  renderFolderFromPath = {(folderAttributes) => this.fetchFilesOfFolder(folderAttributes,true)} />
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
                pwdAttributes = {this.state.currentFolderProperties}
                refreshOpenedFolder = {(folderAttributes)=> this.fetchFilesOfFolder(folderAttributes,true)}
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
    let pathTraversal = this.props.path;
    let carryingFolders = [];
    let bigPathTraversal = [];
    if(pathTraversal.length >= 4) {
      for(let i = 0;i<pathTraversal.length;i++) {
        if(i === 0) {
          bigPathTraversal[0] = (
            <div key={'0'} className="folder-inactive">
              <div style={{fontSize:'24px'}} onClick={() => this.props.homeCall()}>
                {pathTraversal[i].name}
              </div>
              <Icon style={{marginTop:'2%'}} size="large" name="caret right" />
            </div>
          )
          bigPathTraversal[1] = (
            <React.Fragment key="pop-up">
              <Popup
                trigger={<Button content="..." 
                  style={{fontSize:'36px',color:'#a6a6a6',marginTop:'-3%',padding:'0px',backgroundColor:'transparent'}} />
                }
                content={<Table basic style={{width:'30%',border:'0'}}>
                  <Table.Body>
                    {carryingFolders}
                  </Table.Body>
                </Table>}
                on='click'
                position='bottom center'
              />
              <Icon style={{marginTop:'0.45%'}} size="large" name="caret right" />
            </React.Fragment>
          )
        }
        else if(i === tail) {
          bigPathTraversal[2] = (
            <div key={i} className="folder-active">
              <div style={{fontSize:'24px'}} 
                  onClick={() => this.props.renderFolderFromPath(pathTraversal[tail],pathTraversal[tail].type) }>
                {pathTraversal[tail].name}
              </div>
            </div>
          )
        }
        else {
          carryingFolders.push(
            <Table.Row key={pathTraversal[i].kfsID}
                className="dropper_item"
                onClick={()=> this.props.renderFolderFromPath(pathTraversal[i],pathTraversal[i].type)}>
              <Table.Cell style={{width:'10%',paddingRight:'0px'}}><Icon size="big" color="blue" name="folder" /></Table.Cell>
              <Table.Cell style={{width:'80%',fontSize:'16px'}}>{pathTraversal[i].name}</Table.Cell>
            </Table.Row>)
        }
      }
    }
    return (
      <div style={{display:'flex'}}>
      {pathTraversal.length < 4 ? 
        pathTraversal.map((folder,index) => {
          return ( 
              <div key={index} className={tail === index ? "folder-active" : "folder-inactive"}>
                <div style={{fontSize:'24px'}} onClick={() => {
                  if(index === 0) {
                    this.props.homeCall()
                  }
                  else {
                    this.props.renderFolderFromPath(folder,folder.type)
                  }
                }}>{folder.name}</div>
                {tail !== index ? <Icon style={{marginTop:'2%'}} size="large" name="caret right" /> : ''}
              </div>
          )
        }) : 
        bigPathTraversal
      }
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