import React,{Component} from 'react';
import {List,Icon} from 'semantic-ui-react';
import axios from 'axios';
import '../assets/css/fileOptions.css';
class Options extends Component {
    constructor(props) {
      super(props);
      this.state = {
        
      }
    }
    removeFile = () => {
      const fileAttributes = this.props.fileAttributes;
      const folderAttributes = this.props.parentProperties;
      const removeURL = '';
      if(folderAttributes.type === 1) {
        removeURL = 'http://204.48.21.88:3000/Remove?'+
        'appName='+folderAttributes.kfsName+
        '+&senderPub='+this.props.user+
        '&name='+fileAttributes.file_name+
        '&hash='+fileAttributes.file_hash+
        '&type=file'
      }
      axios({
        method:'get',
        url: removeURL,
        auth: {
            username: 'sai',
            password: '123'
        }
      })
      .then( response => {
          console.log(response);
      })
      .catch(error => {
          console.log(error);
      });  
    }
    render() {
      return (
        <List divided verticalAlign='middle'>
          <List.Item style={{padding:'7%',cursor:'pointer'}}
            onClick={() => this.removeFile()}>
            <Icon name="trash" size="large"/>
              <List.Content>
                <List.Header style={{fontSize:'16px',marginTop:'1%'}} as='a'>Delete</List.Header>
              </List.Content>
          </List.Item>
        </List>
      );
    }
  }
export default Options;
