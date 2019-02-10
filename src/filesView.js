import React, { Component } from 'react';
import './App.css';
import { Table,List,Icon,Label,Button,Popup} from 'semantic-ui-react';
import web3 from './web3';
import KIP_LOGO from './assets/KIP_LOGO.png';
import LoadingFileGIF from './assets/loadingFile.gif';
import "./StylingKfsComponents.css";
import axios from 'axios';

class Options extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileHash:props.fileAttributes.file_hash,
      fileName:props.fileAttributes.file_name,
      copyActionStyle:'',
    }
  }

  copyToClipboard() {
    this.setState({copyActionStyle:"animate-copied-message-flicker"});
    const variableThatHoldAreaToCopy = document.createElement('textarea');
    variableThatHoldAreaToCopy.value = this.state.fileHash;
    document.body.appendChild(variableThatHoldAreaToCopy);
    variableThatHoldAreaToCopy.select();
    document.execCommand('copy');
    document.body.removeChild(variableThatHoldAreaToCopy);
    setTimeout(() => {
      this.setState({copyActionStyle:""});
    }, 3000);  
  }

  downloadContent = () => {
    const readingUrl = 'http://localhost:3000/read/'+this.state.fileHash+'?reciPub='+ this.props.b64OfSender;
    axios.get(readingUrl)
    .then( response => {
      const url = window.URL.createObjectURL(new Blob([readingUrl]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download',this.state.fileName); 
      document.body.appendChild(link);
      link.click();
      this.setState({openModalToSeeFile : false});
    })
    .catch(e => {
      console.log(e);
    });
  }

  render() {
    return (
      <List divided verticalAlign='middle'>
        <List.Item style={{padding:'7%',cursor:'pointer'}}>
          <Icon name="share" />
          <List.Content>
            <List.Header as='a'>Share</List.Header>
          </List.Content>
        </List.Item>
        <List.Item style={{padding:'7%',cursor:'pointer'}}
          onClick={() => this.copyToClipboard()}>
          {this.state.copyActionStyle != '' ? 
            <List.Content className={this.state.copyActionStyle}>Copied!</List.Content> :
          <React.Fragment>
            <Icon name="copy" />
            <List.Content>
              <List.Header as='a'>Copy Multihash</List.Header>
            </List.Content>
          </React.Fragment> }
        </List.Item>
        <List.Item style={{padding:'7%',cursor:'pointer'}}
          onClick={() => this.downloadContent()}>
          <Icon name="download" />
          <List.Content>
            <List.Header as='a'>Download</List.Header>
          </List.Content>
        </List.Item>
      </List>
    );
  }
}

class FilesView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      b64OfSender:'',
      loadingContentAction:true,
      filesWithJSX:[],
      fetchFileContentAction:false,
      openedFileName:'',
      source:LoadingFileGIF
    }
  }
  
  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    this.setState({ b64OfSender:window.btoa(accounts[0].toLowerCase()) });
    console.log(this.props.content);
    this.keepDelayInrender();
  }

  keepDelayInrender = () => {
    setTimeout(() => {
      this.setState({loadingContentAction:false});
      this.renderFiles(this.props.content);
    }, 1000);  
  }
  
  renderFiles = files => {
    let filesWithJSX = [];
    if(files.length == 0) {
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
      filesWithJSX = files.map(file => {
      const fileName = file.file_name;
      const indexOfExtension = fileName.lastIndexOf('.');
      const extension = fileName.substr(indexOfExtension+1,fileName.length);
      return (
          <Table.Row key={file.file_hash} className="fileList">
              <Table.Cell>
                <Label color="grey" ribbon>{extension}</Label>
              </Table.Cell>
              <Table.Cell onClick={() => this.fetchContentOfFileAndRender(file.file_hash,fileName)}>{fileName}</Table.Cell>
            <Table.Cell className="options-menu">
            <Popup style={{width:'40%'}}
              trigger={<Button style={{backgroundColor:'transparent',padding:'8% 12% 8% 12%'}} size="huge" icon='ellipsis horizontal' />}
              content = {<Options fileAttributes = {file} {...this.state}/>}
              on='click'
              position='top right'
            />
            </Table.Cell>
          </Table.Row>
        )
      });
    }
    const tableBody = (<Table.Body>{filesWithJSX}</Table.Body>)
    this.setState({filesWithJSX : tableBody});
  }

  fetchContentOfFileAndRender = (fileToBeRead,fileName) => {
    this.setState({ fetchFileContentAction:true,openedFileName:fileName });
    const readingUrl = 'http://localhost:3000/read/'+fileToBeRead+'?reciPub=' + this.state.b64OfSender;
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
  }

  render() {
    return (
      <React.Fragment>
      {this.state.loadingContentAction ? 
        <center>
          <div className="heart-beat-animation">
            <img src={ KIP_LOGO } />
          </div>
        </center> :
        <Table basic="very" compact padded className="content-container">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell style={{width:'15%'}}>
                  Type
                </Table.HeaderCell>
                <Table.HeaderCell style={{width:'65%',wordWrap:'break-word'}}>
                  Name
                </Table.HeaderCell>
                <Table.HeaderCell style={{width:'20%'} }>
                  Options
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            {this.state.filesWithJSX}
        </Table>}
        {this.state.fetchFileContentAction? 
          <div className="modal">
              <div className="modal-content">
                  <span style={{color:'white',fontSize:'24px'}}>{this.state.openedFileName}</span>
                  <span onClick={() => this.setState({fetchFileContentAction:false,source:LoadingFileGIF})} className="close">&times;</span>
                  {this.state.source ==  LoadingFileGIF? 
                      <center>
                          <LoadingComponent />
                      </center> :
                      <center>
                          <img height="75%" width="75%" style={{marginTop :'5%'}} src={ this.state.source } />
                      </center>
                  }
                  {/* {this.state.errorWhileFetching != '' ? 
                      <span style={{color:'white',fontSize:'24px'}} >{this.state.errorWhileFetching}</span> : ''} */}
              </div>
          </div>
      : ''}
      </React.Fragment>
    );
  }
}

export default FilesView;

class LoadingComponent extends Component {
  render() {
    return (
      <div style={{padding:'5% 10% 10% 15%'}}>
          <center>
            <img height="40%" width="40%" style={{marginTop : '100px'}} src={ LoadingFileGIF } />
          </center>
      </div>
    );
  }
}
