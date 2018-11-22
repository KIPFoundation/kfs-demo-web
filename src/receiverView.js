import React, { Component } from 'react';
import { Button, Form, Radio, Input, Message, Grid ,Image} from 'semantic-ui-react';
import logo from './logo.svg';
import './App.css';
import web3 from './ethereum/web3.js';
import axios from 'axios';

class ReceiverView extends Component {

  constructor(props){
    super(props);
    this.state = {
      sender: '',
      hashID:'',
      receipent:'',
      realContent:'',
      source:'',
      visible:false,
      readOnly:false,
      alert:''
    }
  }

  
  componentDidMount() {
    web3.eth.getAccounts().then((accounts, err) => {
      this.setState({receipent: accounts[0]});    
    });
  }

  handleDismiss = () => {
    this.setState({ visible: false });
  }

  getContent = () => {
    this.setState({source:''});
    let url;
    if(!this.state.readOnly) {
      url = 'http://204.48.21.88:3000/appdata/'+this.state.hashID+'?reciPub='+window.btoa(this.state.receipent.toLowerCase());
    }
    else {
      url = 'http://204.48.21.88:3000/read/'+this.state.hashID+'?reciPub='+window.btoa(this.state.receipent.toLowerCase());
    }
    console.log(url);
      axios.get(url)
      .then( response => {
        const returnType = response.headers['content-type'];
        console.log(returnType);
        if(response.data === false) {
          console.log(response.data);
          this.setState({realContent:'UnAuthorized Attempt',visible:true,alert:'KFS Alert'})
        }
        else {
          if(returnType === 'image/jpeg' || returnType === 'image/png' || returnType === 'image/gif') {
            // const test = "data:image/png;"+response.data;
            this.setState({source:url});
          }
          else {
              this.setState({realContent:response.data,visible:true,alert:'KFS Response'})
          }
        }
        //this.setState({realContent:response.data,visible:true})
      })
      .catch((error) => {
        this.setState({realContent:'UnAuthorized Access or Error in Fetching',visible:true,alert:'KFS Alert'})
        console.log(error);
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
            <Grid style={{width:'500px'}}>
              <Grid.Row>
                <Grid.Column width={16}>
                  <Form onSubmit={this.onSubmit}>
                  <br /><br />
                  <Form.Field>
                    <h4>Your Address</h4>
                    <Input style={{ width: "100%" }} size="large"
                    value={this.state.receipent}
                    onChange={event => this.setState({ receipent: event.target.value})}
                    />
                  </Form.Field>
                  <Radio toggle
                      label='fetch read only files'
                      onClick={() => 
                        this.setState({readOnly: !this.state.readOnly})
                      } 
                      checked={this.state.readOnly} />
                      <br /><br />
                  <Form.Field>
                    <h4>Enter KFS file id</h4>
                    <Input style={{ width: "100%" }} size="large"
                    value={this.state.hashID}
                    onChange={event => this.setState({ hashID: event.target.value})}
                    />
                  </Form.Field>
                  { this.state.visible ? 
                    <Form.Field>
                      <Message positive
                      onDismiss={this.handleDismiss}>
                      <Message.Header>{this.state.alert}</Message.Header>
                      <b>
                      {this.state.realContent} 
                      </b>
                    </Message>
                    </Form.Field>
                  : ''}
                  <br/><Button loading={this.state.submitButton}  onClick={this.getContent} primary>Submit</Button>
                  <Form.Field>
                    <br />
                    {this.state.source ? <Image style={{width:'100%'}} src={this.state.source} /> : ''}
                  </Form.Field>
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
