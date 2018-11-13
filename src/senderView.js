import React, { Component } from 'react';
import { Button, Form, Input, Message, Grid , TextArea, Radio ,Modal, Dropdown} from 'semantic-ui-react';
// import logo from './logo.svg';
import './App.css';
import web3 from './ethereum/web3.js';
import axios from 'axios';
import kfs from './ethereum/kfs.js'
class SenderView extends Component {
  constructor(props){
    super(props);
    this.state = {
      sender: '',
      receipent:'',
      private: '',
      base64content: '',
      authErrorMessage: '',
      errorMessage: '',
      checked:false,
      mimeType:'',
      uploadedFile:'',
      hashMessage:'',
      visible: false,
      alert:'',
      fileName:'',
      appID:'',
      readNWrite:false,
      directory:'',
      open: false
    }
  }
  componentDidMount(){
    web3.eth.getAccounts().then((accounts, err) => {
      this.setState({sender: accounts[0]});
    
    });
  }
  handleDismiss = () => {
    this.setState({ visible: false });
  }
  sendRequest = async () => {
      if(this.state.mimeType === '' || this.state.base64content === '' || this.state.receipent === '') {
        this.setState({hashMessage:'Please enter all the credentials',visible:true,alert:'KFS Alert'});
      }
      else  if(this.state.readNWrite) {
        if(this.state.appID === '') {
          this.setState({hashMessage:'Please enter file name',visible:true,alert:'KFS Alert'});
        }
        else {
          const appIdUrl = 'http://204.48.21.88:3000/createAppID/'+this.state.appID;
          axios.get(appIdUrl)
          .then( response => {
            if(response.data === 'false') {
              this.setState({hashMessage:'UnAuthorized Attempt',visible:true,alert:'KFS Alert'})
            }
            else {
              const appIDHash = response.data;
              console.log(this.state.appID+" : "+response.data);
              const updateURL = 'http://204.48.21.88:3000/update?appID='+appIDHash+'&mime='+this.state.mimeType+'&content=base64,'+this.state.base64content+
              '&senderPub='+window.btoa(this.state.sender.toLowerCase())+'&reciPub='+window.btoa(this.state.receipent.toLowerCase());
              console.log(updateURL);
              axios.get(updateURL)
              .then( response => {
                if(response.data === 'false') {
                  this.setState({hashMessage:'UnAuthorized Attempt',visible:true,alert:'KFS Alert'})
                }
                else {
                  this.setState({open:true,fileName:this.state.appID,hashMessage:appIDHash});
                }
              })
              .catch(error => {
                this.setState({hashMessage:'Error in sending request,Please check all the credentials or may be network is down',visible:true,alert:'KFS Alert'});
              });
            }
          })
          .catch(error => {
            this.setState({hashMessage:'Error in sending request,Please check all the credentials or may be network is down',visible:true,alert:'KFS Alert'});
          });
        }
      }
      else {
        const url1 = 'http://204.48.21.88:3000/create?mime='+this.state.mimeType+'&content=base64,'+this.state.base64content+
        '&senderPub='+window.btoa(this.state.sender.toLowerCase())+'&reciPub='+window.btoa(this.state.receipent.toLowerCase());
        console.log(url1);
        axios.get(url1)
        .then( response => {
          if(response.data == 'false') {
            this.setState({hashMessage:'UnAuthorized Attempt',visible:true,alert:'KFS Alert'})
          }
          else {
            this.setState({hashMessage:response.data, open: true})
          }
        })
        .catch(error => {
          this.setState({hashMessage:'Error in sending request,Please check all the credentials or may be network is down',visible:true,alert:'KFS Alert'});
        });
      }
    }
    
    handleUpload = (event) => {
      if(this.state.receipent === '' || this.state.uploadedFile === '' || this.state.sender === '') {
        this.setState({hashMessage:'Please enter all the credentials',visible:true,alert:'KFS Alert'});
      }
      else if(this.state.readNWrite) {
        if(this.state.appID === '') {
          this.setState({hashMessage:'Please enter file name',visible:true,alert:'KFS Alert'});
        }
        else {
          const appIdUrl = 'http://204.48.21.88:3000/createAppID/'+this.state.appID;
          axios.get(appIdUrl)
          .then( response => {
            if(response.data === 'false') {
              this.setState({hashMessage:'UnAuthorized Attempt',visible:true,alert:'KFS Alert'})
            }
            else {
              const appIDHash = response.data;
              const formData = new FormData();
              formData.append('file', this.state.uploadedFile);
              formData.append('appID', appIDHash);
              formData.append('senderPub', window.btoa(this.state.sender.toLowerCase()));
              formData.append('reciPub', window.btoa(this.state.receipent.toLowerCase()));
              axios.post('http://204.48.21.88:3000/upload/update?', formData)
              .then( response => {
                if(response.data === 'false') {
                  this.setState({hashMessage:'UnAuthorized Attempt',visible:true,alert:'KFS Alert'})
                }
                else {
                  this.setState({hashMessage:appIDHash,fileName:this.state.appID,open:true,visible:false})
                }
              })
              .catch(error => {
                this.setState({hashMessage:'Error in sending request,Please check all the credentials or may be network is down',visible:true,alert:'KFS Alert'});
              });
            }
          })
          .catch(error => {
            this.setState({hashMessage:'Error in sending request,Please check all the credentials or may be network is down',visible:true,alert:'KFS Alert'});
          });
        }
      }
      else {
        const data = new FormData();
        data.append('file', this.state.uploadedFile);
        data.append('senderPub', window.btoa(this.state.sender.toLowerCase()));
        data.append('reciPub', window.btoa(this.state.receipent.toLowerCase()));
        console.log(data);
        axios.post('http://204.48.21.88:3000/upload', data)
        .then( response => {
          if(response.data === 'false') {
            this.setState({hashMessage:'UnAuthorized Attempt',visible:true,alert:'KFS Alert'})
          }
          else {
            this.setState({hashMessage:response.data, open:true,visible:false})
          }
        })
        .catch(error => {
          this.setState({hashMessage:'Error in sending request,Please check all the credentials or may be network is down',visible:true,alert:'KFS Alert'});
        });
       }
    }

  saveToBC = async() => {
    try{
      await kfs.methods.saveFile(web3.utils.fromAscii(this.state.fileName),this.state.hashMessage).send({
        from: this.state.sender
      });
      this.setState({open:false,hashMessage:'Your File with name'+this.state.fileName+'has been saved to Blockchain'+this,visible:true,alert:'KFS Alert'})
    }catch(e) {
      console.log(e);
    }
  }
  close = () => this.setState({ open: false });
  render() {
    const mimes = ['text/plain','text/html','image/jpeg','image/png'];
    const mimeOptions = mimes.map((mime,index) => {
      return {
        key : "mime"+index,
        value : "data:"+mime,
        text : mime
      };
    });
    return (
      <div className="App">
        <header className="App-header">
            <Grid style={{width:'500px'}}>
              <Grid.Row>
                <Grid.Column width={16}>   
                    <br /><br />
                    <Radio toggle
                      label='Would like to send as file'
                      onClick={() => 
                        this.setState({checked: !this.state.checked,visible:false,readNWrite:false,appID:'',hashMessage:''})
                      } 
                      checked={this.state.checked} />
                  
                  {!this.state.checked ? 
                  <Form>
                    <Form.Field>
                      <h4>Your address</h4>
                      <Input disabled size="large" style={{ width: "100%"}}
                        value={this.state.sender}      
                      />
                    </Form.Field>
                    <Form.Field>
                      <h4>Enter Receipent's address</h4>
                      <Input style={{ width: "100%" }} size="large"
                      value={this.state.receipent}
                      onChange={event => this.setState({ receipent: event.target.value})}
                      />
                    </Form.Field>            
                    <Form.Field>
                      <h4>Select content's mime here</h4>
                      <Dropdown placeholder='Select Mime type' 
                      onChange={ (e,data) => this.setState({ mimeType : data.value}) }
                      fluid search selection options={mimeOptions} />
                    </Form.Field>
                    <Form.Field>
                    <h4>Enter base64 content here</h4>
                      <TextArea placeholder='Enter Base64 content ' 
                        value={this.state.base64content}
                        onChange={event => this.setState({ base64content: event.target.value})}
                        />
                    </Form.Field>
                    <Radio toggle
                      label='send as read and write'
                      onClick={() => 
                        this.setState({readNWrite: !this.state.readNWrite})
                      } 
                      checked={this.state.readNWrite} />
                       <br />
                    {this.state.readNWrite ? 
                      <Form.Field>
                        <h4>Choose file name to save with</h4>
                        <Input style={{ width: "100%" }} 
                        name="appID"
                        value={this.state.appID}
                        onChange={event => this.setState({appID: event.target.value})}
                      />
                      </Form.Field> 
                      :
                      ""
                    }
                    { this.state.visible ? 
                    <Form.Field>
                      <Message positive
                      onDismiss={this.handleDismiss}>
                      <Message.Header>{this.state.alert}</Message.Header>
                      <b>
                      {this.state.hashMessage} 
                      </b>
                    </Message>
                    </Form.Field>
                  : ''}
                    <Message error header="Oops!" hidden={true} onDismiss={this.errorMessageDismiss} content={this.state.errorMessage} />
                    <br/><Button loading={this.state.submitButton}  onClick={this.sendRequest} primary>Submit</Button>
                  </Form>
                :
                <Form encType="multipart/form-data" method="post">
                    <Form.Field>
                      <h4>Your address</h4>
                      <Input disabled size="large" name="senderPub" style={{ width: "100%"}}
                        value={this.state.sender}      
                      />
                    </Form.Field>
                    <Form.Field>
                      <h4>Enter Receipent's address</h4>
                      <Input style={{ width: "100%" }} 
                      name="reciPub"
                      value={this.state.receipent}
                      onChange={event => this.setState({ receipent: event.target.value})}
                    />
                    </Form.Field>  
                    <Form.Field>
                      <h4>Upload File</h4>          
                      <input type="file" name="file" 
                      onChange={ event => this.setState({uploadedFile : event.target.files[0]})}/>
                    </Form.Field> 
                    <Radio toggle
                      label='send as read and write'
                      onClick={() => 
                        this.setState({readNWrite: !this.state.readNWrite})
                      } 
                      checked={this.state.readNWrite} />
                       <br />
                      {this.state.readNWrite ?  
                      <Form.Field>
                        <h4>Choose file name to save with</h4>
                        <Input style={{ width: "100%" }} 
                        name="appID"
                        value={this.state.appID}
                        onChange={event => this.setState({ appID: event.target.value})}
                      />
                      </Form.Field> 
                      :
                      ""
                      }
                   
                    { this.state.visible ? 
                    <Form.Field>
                      <Message positive
                      onDismiss={this.handleDismiss}>
                      <Message.Header>{this.state.alert}</Message.Header>
                      <b>
                      {this.state.hashMessage} 
                      </b>
                    </Message>
                    </Form.Field>
                  : ''}
                    <Message error header="Oops!" hidden={true} onDismiss={this.errorMessageDismiss} content={this.state.errorMessage} />
                    <br/><Button onClick={this.handleUpload} primary>Submit</Button>
                  </Form>
                }
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </header>
        <Modal
          open={this.state.open}
          onClose={this.close}
        >
          <Modal.Header>Save File ID in Blockchain</Modal.Header>
          <Modal.Content>
            
            <Input style={{width:'70%'}} label={this.state.readNWrite ? 'KFS APP ID' : 'KFS FILE ID'} disabled type="text" value={this.state.hashMessage}/><br /><br />
            <Input style={{width:'70%'}} label="Enter File Name" 
            onChange={event => this.setState({fileName:event.target.value})} 
            value={this.state.fileName} type="text" placeholder="Enter file name to be saved with"/>
            
          </Modal.Content>
          <Modal.Actions>
            Are you sure you want to save your file id
            <Button onClick={this.close} negative>
              No
            </Button>
            <Button onClick={this.saveToBC} positive>
              Save
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}
export default SenderView;