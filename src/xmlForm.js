import React, { Component } from 'react';
import XMLWriter from 'xml-writer';
import { Button, Form, Radio, Input, Message, Dropdown ,Grid ,Modal} from 'semantic-ui-react';
import './App.css';
import web3 from './ethereum/web3.js';
import kfs from './ethereum/kfs.js';
import axios from 'axios';

class XmlForm extends Component {

  constructor(props){
    super(props);
    this.state = {
     userName:'',
     dob:'',
     cno:'',
     existingReceipents:[],
     existingApps:[],
     hashMessage:'',
     open:false,
     fileName:'',
     visible:false,
     readNWrite:false,
     alert:'',
     selectApp:'',
     empID:'',
     appNames:[]
    }
  }

  componentDidMount() {
    web3.eth.getAccounts().then((accounts, err) => {
      this.setState({sender: accounts[0]});   
    });
    let tempReceipents = [];
    const receipents = ['0x8c059e23890ad6e2A423FB5235956e17C7C92d7f','0xD14dc708F6CAb1dF5461F893EB46372db2b54CD8',
    '0x4887BE9f52EfE77F1582107576153DD33071689c','0x9F2C95cDC960b6A2bb9f883b478619bead1c57eE','0x664f3AAE10020BCc201CaaCE4394A93191E487f3',
    '0x377175F8588F6f5f4dBA7Af65924AB69b00A60B6','0xa600B64E72E770A30e40467004B8548a77874921','0x56e988eeF6F15aE8b21754f9bD9c3640f1222804',
    '0x5118f12e9fddccf4e91efa0ac54311f94cf6d871','0x84365fb3525b3acfd6add41cf57a214d6bfdf0b7'];
    let i = 0;
    for(let receiver of receipents) {
        tempReceipents[i++] = {
          key : receiver,
          value : receiver,
          text :'Employee - '+i
        };
      }
      this.setState({existingReceipents : tempReceipents});
      this.getAppsOwned();
  }

  getAppsOwned = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      let appsOfOwner = await kfs.methods.getAppsOfOwner().call({from : accounts[0]});
      console.log(appsOfOwner[0].appName);
      let appNames = [];
      let appIds = [];
      const appsLength = appsOfOwner.length;
      if(appsLength!=0) {
        for(let i=0;i<appsLength;i++) {
          console.log(i);
           appNames[i] = appsOfOwner[i].appName; 
           appIds[i] = appsOfOwner[i].appID;
        }
         
        //Object of App hashes as keys and App names as values
        var bytes32Array = {};
        appIds.forEach((key, i) => bytes32Array[key] = appNames[i]);
        console.log(bytes32Array);

        //Apps Object for addressing dropdown options 
        let tempOwnedApps = [];
        let i=0;
        for(let appName of appNames) {
          let text1 = web3.utils.hexToUtf8(appName);
          tempOwnedApps[i] = {
            key : appName,
            value : appIds[i++],
            text : text1
          };
        }

        this.setState({ existingApps : tempOwnedApps , appNames : bytes32Array  });
      }
    } catch(err){
      console.log(err);
    }
}

  parseToXml = () => {
    let dateLiterals = (this.state.dob).split('-');
    let dateFormat = dateLiterals[1]+"/"+dateLiterals[2]+"/"+dateLiterals[0];
    var xw = new XMLWriter(true);
    xw.startDocument( );
    xw.startElement( 'PersonalInfo' );
            xw.writeElement('Employee ID',this.state.empID);

            xw.writeElement('UserName',this.state.userName);
       
            xw.writeElement('DateOfBirth',dateFormat);
       
            xw.writeElement('ContactNumber',this.state.cno);

    xw.endElement();
    xw.endDocument();
    const content =  xw.output;
    var data = new Blob([content], {
        type: 'text/xml'
    });

    if(!this.state.readNWrite) {
      const formData = new FormData();
      formData.append('file', data);
      formData.append('senderPub', window.btoa(this.state.sender.toLowerCase()));
      formData.append('reciPub', window.btoa(this.state.receipent.toLowerCase()));
      console.log(data);
      axios.post('http://0.0.0.0:3000/upload', formData)
      .then( response => {
        if(response.data === 'false') {
          console.log('false')
        }
        else {
          this.setState({hashMessage : response.data, open : true});
        }
      })
      .catch(error => {
        console.log(error);
      });
    }
    else {
      const formData = new FormData();
      formData.append('file', data);
      formData.append('appID', this.state.selectApp);
      formData.append('senderPub', window.btoa(this.state.sender.toLowerCase()));
      formData.append('reciPub', window.btoa(this.state.receipent.toLowerCase()));
      axios.post('http://0.0.0.0:3000/upload/update?', formData)
      .then( response => {
        if(response.data === 'false') {
          this.setState({hashMessage:'UnAuthorized Attempt',visible:true,alert:'KFS Alert'})
        }
        else {
          console.log(response.data);
          this.setState({hashMessage:response.data,open:true,visible:false})
        }
      })
      .catch(error => {
        this.setState({hashMessage:'Error in sending request,Please check all the credentials or may be network is down',visible:true,alert:'KFS Alert'});
      });
    }
  }

  saveToBC = async() => {
    try{
      if(!this.state.readNWrite) {
        console.log(web3.utils.fromUtf8(this.state.fileName)+"-"+this.state.hashMessage+"-"+this.state.receipent+"-"+this.state.sender)
        await kfs.methods.createFile(web3.utils.fromUtf8(this.state.fileName),this.state.hashMessage,this.state.receipent).send({
          from: this.state.sender
        });
      }
      else {
        console.log(this.state.appNames);
        console.log(this.state.appNames[this.state.selectApp]+":"+this.state.receipent+":"+this.state.hashMessage);
        await kfs.methods.updateApp(this.state.appNames[this.state.selectApp],this.state.hashMessage,this.state.receipent).send({
          from: this.state.sender
        });
      }
      this.setState({open:false,hashMessage:'Your File has been saved to Blockchain',visible:true,alert:'KFS Alert'})
    }catch(e) {
      console.log(e);
    }
  }

  close = () => this.setState({ open: false });

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
                    <h4>Employee ID</h4>
                    <Input style={{ width: "100%" }} size="large"
                    value={this.state.empID}
                    onChange={event => this.setState({ empID: event.target.value})}
                    />
                  </Form.Field>
                  <Form.Field>
                    <h4>User Name</h4>
                    <Input style={{ width: "100%" }} size="large"
                    value={this.state.userName}
                    onChange={event => this.setState({ userName: event.target.value})}
                    />
                  </Form.Field>
                  <Form.Field>
                    <h4>Date Of Birth</h4>
                    <Input type='date' style={{ width: "100%" }} size="large"
                    value={this.state.dob}
                    onChange={event => this.setState({ dob: event.target.value})}
                    />
                  </Form.Field>
                  <Form.Field>
                    <h4>Contact Number</h4>
                    <Input style={{ width: "100%" }} size="large"
                    value={this.state.cno}
                    onChange={event => this.setState({ cno : event.target.value})}
                    />
                  </Form.Field>
                  <Form.Field>
                        <h4>Select Recipient</h4>
                         <Dropdown className="form-control"  placeholder="Select Receipent" value={this.state.receipent}
                        onChange={ (e,data) => this.setState({receipent: data.value})}
                        fluid selection options={this.state.existingReceipents} />
                  </Form.Field> 
                  {/* <Radio toggle
                      label='Update App'
                      onClick={() => 
                        this.setState({readNWrite: !this.state.readNWrite})
                      } 
                      checked={this.state.readNWrite} />
                       <br /><br />
                    {this.state.readNWrite ? 
                      <Form.Field>
                         <Dropdown className="form-control"  placeholder="Select App" value={this.state.selectApp}
                        onChange={ (e,data) => this.setState({selectApp: data.value})}
                        fluid selection options={this.state.existingApps} />
                      </Form.Field> 
                      :
                      ""
                    } */}
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
                  <br/><Button loading={this.state.loadingAnimation}  onClick={this.parseToXml} primary>Submit</Button>
                </Form>
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
            {!this.state.readNWrite ? <Input style={{width:'70%'}} label="Enter File Name" 
            onChange={event => this.setState({fileName:event.target.value})} 
            value={this.state.fileName} type="text" placeholder="Enter file name to be saved with"/> 
            : ''}
            
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
        {/* <xmp style={{color:'white'}} >{this.state.xml}</xmp> */}
        </div>
    );
  }
}

export default XmlForm;
