import React, { Component } from 'react';
import {Input,Image,Table,Icon,Button,Popup} from 'semantic-ui-react';
import web3 from '../miscellaneous/web3';
import KIP_LOGO from '../assets/KIP_LOGO.png';
import '../assets/css/contentView.css';
import axios from 'axios';
import RightPaneComponent from './rightPaneComponents';
import AccountOptions from './accountOptions';
import Options from './FileOptions';

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
  
  fetchFilesOfFolder = (folderID,folderName) => {
    this.setState({filesWithJSX:<FakeContent />});
    const url = 'http://204.48.21.88:3000/appdata/'+folderID+'?reciPub='+this.state.b64OfSender;
    console.log(url);
    axios.get(url)
    .then( response => {
        const innerFiles = response.data.files;
        let tempPathTraversal = this.state.pathTraversal;
        tempPathTraversal.push(folderName);
        this.setState({filesWithJSX : this.renderFiles(innerFiles) , pathTraversal : tempPathTraversal });
    })
    .catch(error => {
        console.log(error);
    });      
  }

  renderFiles = filesnFolders => {
    console.log(filesnFolders);
    let filesWithJSX = [];
    if(filesnFolders.length === 0) {
      filesWithJSX.push(
        <React.Fragment>
          <Table.Row ><Table.Cell style={{padding:'3%'}}/><Table.Cell /><Table.Cell /></Table.Row>
          <Table.Row><Table.Cell style={{padding:'3%'}}/><Table.Cell /><Table.Cell /></Table.Row>
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
      filesWithJSX = filesnFolders.map(file => {
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
                  <Table.Cell onClick={() => this.fetchContentOfFileAndRender(file.file_hash,fileName)}>
                    <Icon  color="blue" name={file_icon} size="large"/>
                  </Table.Cell>
                  <Table.Cell onClick={() => this.fetchContentOfFileAndRender(file.file_hash,fileName)}>
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
        else {
          const folderName = file.app_name;
          return (
              <Table.Row key={file.app_hash} className="fileList">
                  <Table.Cell>
                    <Icon color="blue" name="folder outline" size="big"/>
                  </Table.Cell>
                  <Table.Cell onClick={() => this.fetchFilesOfFolder(file.app_hash,folderName)}>
                    <span className="file_name_css">{folderName}</span>
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
      });
    }
    const tableBody = (<Table.Body>{filesWithJSX}</Table.Body>);
    return tableBody;
  }

  fetchContentOfFileAndRender = (fileToBeRead,fileName) => {
    this.setState({ fetchFileContentAction:true,openedFileName:fileName });
    const readingUrl = 'http://204.48.21.88:3000/read/'+fileToBeRead+'?reciPub=' + this.state.b64OfSender;
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
            this.setState({ source:readingUrl });
          }
          else if(returnType === 'video/mp4' || returnType === 'video/quicktime' || returnType === 'video/x-flv' || returnType === 'video/x-msvideo' || returnType === 'video/x-matroska') {
            const link = document.createElement('a');
            link.href = readingUrl;
            link.setAttribute('target', "_blank"); 
            document.body.appendChild(link);
            link.click();
            this.setState({fetchFileContentAction : false});
          }
          else if(returnType === 'application/pdf') {
              const link = document.createElement('a');
              link.href = readingUrl;
              link.setAttribute('target', "_blank"); 
              document.body.appendChild(link);
              link.click();
              this.setState({fetchFileContentAction : false});
          }
          else {
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', fileName); //or any other extension
              document.body.appendChild(link);
              link.click();
              this.setState({fetchFileContentAction : false});
          }
        }
      })
      .catch((error) => {
          this.setState({errorWhileFetching:'Error while fetching file content, this may be because you might deleted it',source:''});
        console.log(error);
    });
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
                  homeCall = {() => this.keepDelayInrender()} />
              </div>
              <div className="normal-search-box">
                  <Input style={{ width: "100%"}} iconPosition = "left" icon='search' placeholder='Search by Mutlihash' transparent/>
              </div>
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
                uploadFileHandler={(file) => this.uploadFileToKFS(file)}
                refreshDrive = {() => this.fetchSitemapOfUser()}
                user = {this.state.loggedInUser}
                foldersOwned = {this.state.existingApps}
            />
          </div>
        </div>
        {this.state.fetchFileContentAction? 
          <div className="modal">
              <div className="modal-content">
                  <span style={{color:'white',fontSize:'24px'}}>{this.state.openedFileName}</span>
                  <span onClick={() => this.setState({fetchFileContentAction:false,source:KIP_LOGO})} className="close">&times;</span>
                  {this.state.source ===  KIP_LOGO? 
                      <center>
                          <LoadingComponent />
                      </center> :
                      <center>
                          <Image height="75%" width="75%" style={{marginTop :'5%'}} src={ this.state.source } />
                      </center>
                  }
              </div>
          </div>
      : ''}
      </React.Fragment>
    );
  }
}

export default ContentView;

class LoadingComponent extends Component {
  render() {
    return (
      <div className="heart-beat-animation">
          <center>
            <Image height="40%" width="40%" style={{marginTop : '100px'}} src={ KIP_LOGO } />
          </center>
      </div>
    );
  }
}

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