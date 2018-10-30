import React, { Component } from 'react';
import { Button, Form, Input, Message, Grid , TextArea, Radio , Dropdown} from 'semantic-ui-react';
// import logo from './logo.svg';
import './App.css';
import web3 from './ethereum/web3.js';
import axios from 'axios';

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
      visible: false 
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
    // axios.get('//204.48.21.88:3000/create?mime=data:text/plain&content=base64,TWFuIGlzIGRpc3Rpbmd1aXNoZWQsIG5vdCBvbmx5IGJ5IGhpcyByZWFzb24sIGJ1dCBieSB0aGlzIHNpbmd1bGFyIHBhc3Npb24gZnJvbSBvdGhlciBhbmltYWxzLCB3aGljaCBpcyBhIGx1c3Qgb2YgdGhlIG1pbmQsIHRoYXQgYnkgYSBwZXJzZXZlcmFuY2Ugb2YgZGVsaWdodCBpbiB0aGUgY29udGludWVkIGFuZCBpbmRlZmF0aWdhYmxlIGdlbmVyYXRpb24gb2Yga25vd2xlZGdlLCBleGNlZWRzIHRoZSBzaG9ydCB2ZWhlbWVuY2Ugb2YgYW55IGNhcm5hbCBwbGVhc3VyZS4=
    //&senderPub=MHg3MTExRmVBOGVEZUZhMTEzMTFGMDA2QkI1Y0UxQTA0Yzg4OTg2OEE4&reciPub=MHhjYTg0MzU2OWUzNDI3MTQ0Y2VhZDVlNGQ1OTk5YTNkMGNjZjkyYjhl')
    // .then(function (response) {
    //   console.log(response);
    // })
    // .catch(function (error) {
    //   console.log(error);
    // });
    console.log(window.btoa(this.state.sender));
    console.log(window.btoa(this.state.receipent));
    console.log(this.state.mimeType);
    console.log(this.state.base64content);
    console.log(this.state.uploadedFile);
    
    if(this.state.mime !=='' && this.state.base64content!=='' && this.state.uploadedFile==='') {
      const url1 = 'http://204.48.21.88:3000/create?mime='+this.state.mimeType+'&content=base64,'+this.state.base64content+'&senderPub='+window.btoa(this.state.sender.toLowerCase())+'&reciPub='+window.btoa(this.state.receipent.toLowerCase());
      const url = 'http://204.48.21.88:3000/create?mime=data:text/plain&content=base64,aGVsbG8=&senderPub=MHg4YzA1OWUyMzg5MGFkNmUyYTQyM2ZiNTIzNTk1NmUxN2M3YzkyZDdm&reciPub=MHg0ODg3YmU5ZjUyZWZlNzdmMTU4MjEwNzU3NjE1M2RkMzMwNzE2ODlj';

      console.log(url1);
      axios.get(url1)
      .then( response => {
        console.log(response);
        this.setState({hashMessage:response.data,visible:true})
      })
      .catch(function (error) {
        console.log(error);
      });
    }

    else {
      console.log('coming');
      axios.get('//204.48.21.88:3000/create?path='+this.state.uploadedFile+'&senderPub='
      +window.btoa(this.state.sender.toLowerCase())+'&reciPub='+window.btoa(this.state.receipent.toLowerCase()))
      .then(response => {
        console.log(response);
        this.setState({hashMessage:response.data,visible:true})
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }

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
            <Grid>
              <Grid.Row>
                <Grid.Column width={16}>
                  <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
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
                  {/* <Form.Field>
                    <h4>Enter Private key</h4>
                    <Input style={{ width: "100%" }}
                      value={this.state.private}
                      onChange={event => this.setState({ private: event.target.value})}
                    />
                  </Form.Field> */}
                  <Form.Field>
                  <Radio toggle
                    label={this.state.checked ? 'Would like to send a file' : 'Would like to send base64 content'}
                    onClick={() => 
                      this.setState({checked: !this.state.checked})
                    } 
                    checked={this.state.checked} />
                  </Form.Field>             
                {/* {this.state.checked ?  */}
                    <Form.Field>
                      <h4>Select content's mime here</h4>
                      <Dropdown placeholder='Select Mime type' 
                      onChange={ (e,data) => this.setState({ mimeType : data.value}) }
                      fluid search selection options={mimeOptions} />
                      {/* <Input style={{ width: "100%" }}
                        value={this.state.mime}
                        onChange={event => this.setState({ mime: event.target.value})}
                      /> */}
                    </Form.Field>
                    <Form.Field>
                    <h4>Enter base64 content here</h4>
                     <TextArea placeholder='Base64 content ' 
                        value={this.state.base64content}
                        onChange={event => this.setState({ base64content: event.target.value})}
                        />
                    </Form.Field>
                    
                    
                  

                  <div className="upload-btn-wrapper" style={{fontSize:''}}>
                    <br/>
                    <b>Upload a file</b>
                      {/* <button className="btn-primary">Upload */}
                      <input type="file" name="myfile"  onChange={event => this.setState({uploadedFile : event.target.files[0]})}/>
                      {/* </button> */}
                  </div> 
                  { this.state.visible ? 
                    <Form.Field>
                      <Message positive
                      onDismiss={this.handleDismiss}>
                      <Message.Header>Kfs File Id</Message.Header>
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
