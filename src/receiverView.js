import React, { Component } from 'react';
import { Button, Form, Input, Message, Grid , TextArea, Radio } from 'semantic-ui-react';
// import logo from './logo.svg';
import './App.css';
import web3 from './ethereum/web3.js';
import axios from 'axios';

class ReceiverView extends Component {

  constructor(props){
    super(props);
    this.state = {
      sender: '',
      hashMessage:'',
      realContent:'',
      visible:false
    }
  }

  handleDismiss = () => {
    this.setState({ visible: false });
  }

  getContent = () => {
      axios.get('//204.48.21.88:3000/read/'+this.state.hashMessage+'?senderPub='+window.btoa(this.state.sender))
      .then( response => {
        console.log(response);
        this.setState({realContent:response.data,visible:true})
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
            <Grid>
              <Grid.Row>
                <Grid.Column width={16}>
                  <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                  <Form.Field>
                    <h4>Enter Sender's address</h4>
                    <Input style={{ width: "100%" }} size="large"
                    value={this.state.sender}
                    onChange={event => this.setState({ sender: event.target.value})}
                    />
                  </Form.Field>
                  <Form.Field>
                    <h4>Enter KFS file id</h4>
                    <Input style={{ width: "100%" }} size="large"
                    value={this.state.hashMessage}
                    onChange={event => this.setState({ hashMessage: event.target.value})}
                    />
                  </Form.Field>
                  { this.state.visible ? 
                    <Form.Field>
                      <Message positive
                      onDismiss={this.handleDismiss}>
                      <Message.Header>Actual Content</Message.Header>
                      <b>
                      {this.state.realContent} 
                      </b>
                    </Message>
                    </Form.Field>
                  : ''}
                  <Message error header="Oops!" hidden={true} onDismiss={this.errorMessageDismiss} content={this.state.errorMessage} />
                  <br/><Button loading={this.state.submitButton}  onClick={this.getContent} primary>Submit</Button>
                </Form>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </header>
      </div>
    );
  }
}

export default ReceiverView;
