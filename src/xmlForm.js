import React, { Component } from 'react';
import XMLWriter from 'xml-writer';
import { Button, Form, Radio, Input, Message, Dropdown ,Grid ,Modal} from 'semantic-ui-react';
import './App.css';
import web3 from './ethereum/web3.js';
import axios from 'axios';
import kfs from './ethereum/kfs.js';


class XmlForm extends Component {

  constructor(props){
    super(props);
    this.state = {
     userName:'',
     dob:'',
     cno:'',
     existingReceipents:[],
     hashMessage:'',
     open:false,
     fileName:'',
     visible:false,
     alert:''
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
      this.setState({existingReceipents : tempReceipents})
  }

  parseToXml = () => {
    // let dateLiterals = (this.state.dob).split('-');
    // let dateFormat = dateLiterals[1]+"/"+dateLiterals[2]+"/"+dateLiterals[0];
    // let current_date = new Date(dateFormat).getTime();
    // const locale = "en-us";
    // const month = current_date.toLocaleString(locale, { month: "short" });
    // const dateOfBirth = current_date.getDate() + "-" + month + "-" + current_date.getFullYear();

    var xw = new XMLWriter(true);
    xw.startDocument( );
    xw.startElement( 'PersonalInfo' );
       
            xw.writeElement('UserName',this.state.userName);
       
            xw.writeElement('DateOfBirth',this.state.dob);
       
            xw.writeElement('ContactNumber',this.state.cno);

    xw.endElement();
    xw.endDocument();
    const content =  xw.output;
    var data = new Blob([content], {
        type: 'text/xml'
    });
     this.setState({xml : content})
    const formData = new FormData();
    formData.append('file', data);
    formData.append('senderPub', window.btoa(this.state.sender.toLowerCase()));
    formData.append('reciPub', window.btoa(this.state.receipent.toLowerCase()));
    console.log(data);
    axios.post('http://204.48.21.88:3000/upload', formData)
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

  saveToBC = async() => {
    try{
        await kfs.methods.createFile(web3.utils.fromAscii(this.state.fileName),this.state.hashMessage).send({
          from: this.state.sender
        });
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
            
            <Input style={{width:'70%'}} label='KFS FILE ID' disabled type="text" value={this.state.hashMessage}/><br /><br />
            <Input style={{width:'70%'}} label="Enter File Name" 
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
