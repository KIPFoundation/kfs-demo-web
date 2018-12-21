import React, { Component } from 'react';
import { Button, Form, Radio, Input, Message, Dropdown ,Grid ,Image , Modal} from 'semantic-ui-react';
import './App.css';
import web3 from './ethereum/web3.js';
import axios from 'axios';
import kfs from './ethereum/kfs.js'

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
      existingApps:[],
      alert:'',
      videoSource:false,
      VideoSource:'',
      xml:''
    }
  }

  
  componentDidMount() {
    web3.eth.getAccounts().then((accounts, err) => {
      this.setState({receipent: accounts[0]});    
    });
    this.getAppsOwned();
  }

  getAppsOwned = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      let appsLength = await kfs.methods.getAppCount().call({from : accounts[0]});
      console.log(appsLength);
      let appNames = [];
      let appIds = [];
      if(appsLength!=0) {
        for(let i=0;i<appsLength;i++) {
          let app = await kfs.methods.getAppOfIndex(i).call({from:accounts[0]});
           appNames[i] = app.retAppName; 
           appIds[i] = app.retAppID;
        }
        // const appNames = apps.retAppNames;  //['QmPKJ1vdAXu5FfuCFrhKsLWE4QLUG7z7V4uD5ELDwNvWu2','QmNz8vWHWpHVndTxyLFjmWewPGnmYNLGGYzpGLiMocZYZH'];
        // const appIds = apps.retAppIDs; //['First App','Pathan App'];
        let tempOwnedApps = [];
        let i=0;
        for(let appName of appNames) {
          tempOwnedApps[i] = {
            key : appName,
            value : appIds[i++],
            text : web3.utils.hexToAscii(appName)
          };
        }
        this.setState({ existingApps : tempOwnedApps  });
      }
      else {
        
      }
    } catch(err){
      console.log(err);
    }
}
  handleDismiss = () => {
    this.setState({ visible: false });
  }

  getContent = () => {
    this.setState({source:''});
    let url;
    // if(!this.state.readOnly) {
    if(false) {
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
              if(returnType === 'text/xml; charset=utf-8') {
                this.setState({xml : response.data});
              }
              else {
                if(returnType == 'text/plain; charset=utf-8') {
                  console.log(response.data);
                }
                else if(returnType == 'video/mp4') {
                  this.setState({VideoSource:url,videoSource:true,open:true});
                }
                else {
                  this.setState({realContent:response.data,visible:true,alert:'KFS Response'})
                }
              }
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
                  {/* <Radio toggle
                      label='fetch read only files'
                      onClick={() => 
                        this.setState({readOnly: !this.state.readOnly,hashID:''})
                      } 
                      checked={this.state.readOnly} />
                      <br /><br />
                      {this.state.readOnly ? 
                        <Form.Field>
                        <h4>Enter KFS file id</h4>
                        <Input style={{ width: "100%" }} size="large"
                        value={this.state.hashID}
                        onChange={event => this.setState({ hashID: event.target.value})}
                        />
                      </Form.Field>
                      :
                      <Form.Field>
                         <Dropdown className="form-control"  placeholder="Select App" value={this.state.hashID}
                        onChange={ (e,data) => this.setState({hashID: data.value})}
                        fluid selection options={this.state.existingApps} />
                      </Form.Field> 
                    } */}
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
                    {this.state.xml!='' ? <xmp style={{color:'white'}} >{this.state.xml}</xmp> :''}
                    {this.state.videoSource? <video width="320" height="240" controls>
                                                <source src={this.state.VideoSource} type="video/mp4" />
                                                Your browser does not support the video tag.
                                              </video> :''}
                  </Form.Field>
                </Form>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </header>
        {/* {this.state.videoSource? 
        <Modal
        open={this.state.open}>
          <Modal.Description>
            <video width="500" height="500" controls>
              <source src={this.state.VideoSource} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Modal.Description>
        </Modal> : ''} */}
      </div>
    );
  }
}

export default ReceiverView;
