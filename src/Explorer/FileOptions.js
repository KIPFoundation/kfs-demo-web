import React,{Component} from 'react';
import {List,Icon} from 'semantic-ui-react';
import axios from 'axios';
import '../assets/css/fileOptions.css';
class Options extends Component {
    constructor(props) {
      super(props);
      this.state = {
        fileHash:props.fileAttributes.file_hash,
        fileName:props.fileAttributes.file_name,
        copyActionStyle:'',
        removeAcknowledgemnet:'',
        deletionContent:''
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
      // const readingUrl = 'http://204.48.21.88:3000/read/'+this.state.fileHash+'?reciPub='+ this.props.b64OfSender;
      console.log(this.state.fileName);
      // axios.get(readingUrl)
      // .then( response => {
      //   const url = window.URL.createObjectURL(new Blob([readingUrl]));
      //   const link = document.createElement('a');
      //   link.href = url;
      //   link.setAttribute('download',this.state.fileName); 
      //   document.body.appendChild(link);
      //   link.click();
      //   this.setState({openModalToSeeFile : false});
      // })
      // .catch(e => {
      //   console.log(e);
      // });
    }
  
    removeFile = () => {
      const removeEndpoint = 'http://204.48.21.88:3000/Remove?appName='+this.props.path[1]+'&senderPub='+this.props.b64Sender+'&name='+this.state.fileName+'&hash='+this.state.fileHash;
      console.log(removeEndpoint);
      axios.get(removeEndpoint)
      .then(response => {
          // if(response.data === 'Permission denied') {
          //     this.setState({deletionContent:"Permission denied"});
          //     setTimeout(() => {
          //       this.setState({copyActionStyle:""});
          //     }, 3000); 
          // }
          // else {
          //   this.setState({deletionContent:"File has Removed"});          
          //   setTimeout(() => {
          //     this.setState({copyActionStyle:""});
          //   }, 3000); 
          // }
          console.log(response);
      })
      .catch(e => {
          console.log(e);
      })
    }
  
    render() {
      return (
        <List divided verticalAlign='middle'>
          {/* <List.Item style={{padding:'7%',cursor:'pointer'}}
            onClick={() => this.copyToClipboard()}>
            {this.state.copyActionStyle !== '' ? 
              <List.Content className={this.state.copyActionStyle}>Copied!</List.Content> :
            <React.Fragment>
              <Icon name="copy" />
              <List.Content>
                <List.Header as='a'>Copy Multihash</List.Header>
              </List.Content>
            </React.Fragment>}
          </List.Item> */}
          <List.Item style={{padding:'7%',cursor:'pointer'}}
            onClick={() => this.removeFile()}>
            {this.state.copyActionStyle !== '' ? 
              <List.Content className={this.state.copyActionStyle}>{this.state.deletionContent}</List.Content> :
            <React.Fragment>
              <Icon name="trash" />
              <List.Content>
                <List.Header as='a'>Delete</List.Header>
              </List.Content>
            </React.Fragment>}
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
export default Options;
