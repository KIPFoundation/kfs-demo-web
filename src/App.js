import React, { Component } from 'react';
import { Button, Form, Input, Message, Grid , TextArea, Radio } from 'semantic-ui-react';
// import logo from './logo.svg';
import './App.css';
import web3 from './ethereum/web3.js';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      sender: '',
      receipent:'',
      private: '',
      base64content: '',
      authErrorMessage: '',
      errorMessage: ''
    }
  }

  componentDidMount(){
    web3.eth.getAccounts().then((accounts, err) => {
      this.setState({sender: accounts[0]});
      console.log(err);
    });
  }

  upload = () => {
    console.log("File getting uploaded");
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          
            <h3>KFS DEMO</h3>
            <Grid>
              <Grid.Row>
                <Grid.Column width={16}>
                  <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                  <Form.Field>
                    <h4>Enter sender's address</h4>
                    <Input size="large" style={{ width: "100%"}}
                      value={this.state.sender}
                      onChange={event => this.setState({ sender: event.target.value})}
                    />
                  </Form.Field>
                  <Form.Field>
                    <h4>Enter receipent's address</h4>
                    <Input style={{ width: "100%" }} size="large"
                    value={this.state.receipent}
                    onChange={event => this.setState({ receipent: event.target.value})}
                    />
                  </Form.Field>
                  <Form.Field>
                    <h4>Enter private key</h4>
                    <Input style={{ width: "100%" }}
                      value={this.state.private}
                      onChange={event => this.setState({ private: event.target.value})}
                    />
                  </Form.Field>
                  <Radio toggle />
                  <Form.Field>
                    <h4>Enter content's mime here</h4>
                    <Input style={{ width: "100%" }}
                      value={this.state.mime}
                      onChange={event => this.setState({ mime: event.target.value})}
                    />
                  </Form.Field>
                  <Form.Field>
                    <h4>Enter base64 content here</h4>
                    <TextArea placeholder='Base64 content ' 
                      value={this.state.base64content}
                      onChange={event => this.setState({ base64content: event.target.value})}
                      />
                    {/* <Input style={{ width: "100%" }}
                      value={this.state.base64content}
                      onChange={event => this.setState({ base64content: event.target.value})}
                    /> */}
                  </Form.Field>
                  <div className="upload-btn-wrapper" style={{fontSize:''}}>
                  <br/>
                  <b>Upload a file</b>
                    {/* <button className="btn-primary">Upload */}
                    <input type="file" name="myfile"  onChange={event => this.upload(event.target.files[0])}/>
                    {/* </button> */}
                  </div> 
              
                  {/* <Message error header="Oops!" hidden={this.state.errorMessage === ""} onDismiss={this.errorMessageDismiss} content={this.state.errorMessage} /> */}
                  <Message error header="Oops!" hidden={true} onDismiss={this.errorMessageDismiss} content={this.state.errorMessage} />
                  <Button loading={this.state.submitButton} primary>Submit</Button>
                </Form>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </header>
      </div>
    );
  }
}

export default App;
