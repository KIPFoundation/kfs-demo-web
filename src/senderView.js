import React, { Component } from 'react';
import { Button, Form, Input, Message, Grid , TextArea, Radio , Dropdown} from 'semantic-ui-react';
// import logo from './logo.svg';
import './App.css';
import web3 from './ethereum/web3.js';
import axios from 'axios';

let fileByteArray = [];

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
      alert:''
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

  sendRequest = () => {
    if(this.state.checked === true) {
      if(this.state.mimeType === '' || this.state.base64content === '' || this.state.receipent === '') {
        this.setState({hashMessage:'Please enter all the credentials',visible:true,alert:'KFS Alert'});
      }
      else {
        const url1 = 'http://204.48.21.88:3000/create?mime='+this.state.mimeType+'&content=base64,'+window.btoa(this.state.base64content)+
        '&senderPub='+window.btoa(this.state.sender.toLowerCase())+'&reciPub='+window.btoa(this.state.receipent.toLowerCase());
        axios.get(url1)
        .then( response => {
          console.log(response);
          this.setState({hashMessage:response.data,visible:true,alert:'KFS File ID'})
        })
        .catch(error => {
          this.setState({hashMessage:'Error in sending request,Please check all the credentials or may be network is down',visible:true,alert:'KFS Alert'});
        });
      }
    }
    else {
      if(this.state.uploadedFile === '' || this.state.receipent === '') {
        this.setState({hashMessage:'Please enter all the credentials',visible:true,alert:'KFS Alert'});
      }
      else {
        axios.get('//204.48.21.88:3000/create?file='+this.state.uploadedFile+'&senderPub='
        +window.btoa(this.state.sender.toLowerCase())+'&reciPub='+window.btoa(this.state.receipent.toLowerCase()))
        .then(response => {
          console.log(response);
          this.setState({hashMessage:response.data,visible:true,alert:'KFS File ID'})
        })
        .catch(error => {
          this.setState({hashMessage:'Error in sending request,Please check all the credentials or may be network is down',visible:true,alert:'KFS Alert'});
        });
      }
    }
  }


  fileToByteConversion = (fileObject) => {
    console.log(fileObject);
    this.setState({uploadedFile:fileObject});
    // var reader = new FileReader();
    // reader.onload = this.processFile(fileObject);
    // reader.readAsArrayBuffer(fileObject); 
  }
  
  // processFile = (theFile) => {
  //   return function(e) { 
  //     var theBytes = e.target.result;
  //     //console.log(theBytes);
  //     fileByteArray = theBytes;
  //   }
  // }

  
  // fileToByteConversion = fileObject => {
  //   let reader = new FileReader();
  //   reader.onload = event => { 
  //     if (event.target.readyState === FileReader.DONE) {
  //       var arrayBuffer = event.target.result,
  //       fileByteArray = Arrays.toString(arrayBuffer.getBytes())
  //       //  this.setState({uploadedBArray:fileByteArray});
  //     }
  //   }
  //   reader.readAsArrayBuffer(fileObject); 
  //   console.log(fileByteArray);
  //   //this.setState({uploadedBArray:fileByteArray});
  // }

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
                  <Form method="post" encType="multipart/form-data" >
                  <br /><br />
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
                  <Radio toggle
                    label={this.state.checked ? 'Would like to send as file' : 'Would like to send as base64 content'}
                    onClick={() => 
                      this.setState({checked: !this.state.checked})
                    } 
                    checked={this.state.checked} />
                  </Form.Field>             
                {this.state.checked ? 
                  <div>
                    <Form.Field>
                      <h4>Select content's mime here</h4>
                      <Dropdown placeholder='Select Mime type' 
                      onChange={ (e,data) => this.setState({ mimeType : data.value}) }
                      fluid search selection options={mimeOptions} />
                    </Form.Field>
                    <Form.Field>
                    <h4>Enter data here</h4>
                     <TextArea placeholder='Will be converted to Base64 content ' 
                        value={this.state.base64content}
                        onChange={event => this.setState({ base64content: event.target.value})}
                        />
                    </Form.Field>
                  </div>
                :
                  
                  <div className="upload-btn-wrapper" style={{fontSize:''}}>
                    <br/>
                    <b>Upload a file</b>
                      <input type="file" name="file" 
                      onChange={ event => this.fileToByteConversion(event.target.files[0])}/>
                      {/* onChange={ event => this.setState({ uploadedFile : event.target.files[0]})}/> */}
                  </div> 
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
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </header>
      </div>
    );
  }
}

export default SenderView;
