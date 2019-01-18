import React, { Component } from 'react';
import { Button, Form, Modal, Input, Message, Grid} from 'semantic-ui-react';
import './App.css';
import web3 from './ethereum/web3.js';
import axios from 'axios';
import kfs from './ethereum/kfs.js'

class ReceiverView extends Component {

  constructor(props){
    super(props);
    this.state = {
      sender: '',
      appName:'',
      visable:false,
      alert:'',
      appIDHash:'',
      realContent:'',
      open:false,
    }
  }

  
  componentDidMount() {
    web3.eth.getAccounts().then((accounts, err) => {
      this.setState({sender: accounts[0]});    
    });
  }

  saveToBC = async() => {
    console.log(web3.utils.fromUtf8(this.state.appName)+' : '+this.state.appIDHash);
    try{
      await kfs.methods.createApp(web3.utils.fromUtf8(this.state.appName.trim()),this.state.appIDHash).send({
        from: this.state.sender
      });
      this.setState({realContent:'AppID :'+this.state.appIDHash+' has been created successfully',open:false,visible:true,alert:'KFS Alert'})
    }catch(e) {
      console.log(e);
    }
  }


  close = () => this.setState({ open: false });

  handleDismiss = () => {
    this.setState({ visible: false });
  }

  getAppID = () => {
    const appIdUrl = 'http://204.48.21.88:3000/createAppID/'+this.state.appName.trim()+'?sender='+window.btoa(this.state.sender.toLowerCase());
    console.log(appIdUrl);    
    let appIDHash = '';
          axios.get(appIdUrl)
          .then( response => {
            if(response.data == 'false') {
              this.setState({realContent:'UnAuthorized Attempt',visible:true,alert:'KFS Alert'})
            }
            else {
              appIDHash = response.data;
              console.log(this.state.appName+" : "+appIDHash);
              this.setState({appIDHash:appIDHash,open:true})              
            }
          })
          .catch(error => {
            console.log(error);
            this.setState({hashMessage:'Error in sending request,Please check all the credentials or may be network is down',visible:true,alert:'KFS Alert'});
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
                    value={this.state.sender}
                    onChange={event => this.setState({ sender: event.target.value})}
                    />
                  </Form.Field>
                  <Form.Field>
                    <h4>Enter folder name you want to save files into</h4>
                    <Input style={{ width: "100%" }} size="large"
                    value={this.state.appName}
                    onChange={event => this.setState({ appName: event.target.value})}
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
                  <br/><Button loading={this.state.submitButton}  onClick={this.getAppID} primary>Create</Button>
                </Form>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </header>
        <Modal
          open={this.state.open}
          onClose={this.close}
        >
        <Modal.Header>Are you sure that you want to create App with {this.state.appName} ?</Modal.Header>
          <Modal.Actions>
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

export default ReceiverView;
