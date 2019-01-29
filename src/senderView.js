import React, { Component } from 'react';
<<<<<<< HEAD
import { Button, Form, Input, Message, Grid , TextArea, Radio ,Modal, Dropdown} from 'semantic-ui-react';
// import logo from './logo.svg';
import './App.css';
=======
import { Button, Form, Input, Message, Grid ,Image, TextArea, Radio ,Modal, Dropdown} from 'semantic-ui-react';
// import logo from './logo.svg';
import './App.css';
import UploadingGIF from './uploading_image.gif'
>>>>>>> development
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
<<<<<<< HEAD
      checked:false,
=======
      checked:true,
>>>>>>> development
      mimeType:'',
      uploadedFile:'',
      hashMessage:'',
      visible: false,
      alert:'',
      fileName:'',
<<<<<<< HEAD
      open: false
=======
      appID:'',
      readNWrite:false,
      selectApp:'',
      uploading:false,
      existingApps:[],
      existingReceipents:[],
      appNames:[],
      open:false
>>>>>>> development
    }
  }
  componentDidMount(){
    web3.eth.getAccounts().then((accounts, err) => {
<<<<<<< HEAD
      this.setState({sender: accounts[0]});
    
    });
  }
  handleDismiss = () => {
    this.setState({ visible: false });
  }
  sendRequest = () => {
      if(this.state.mimeType === '' || this.state.base64content === '' || this.state.receipent === '') {
        this.setState({hashMessage:'Please enter all the credentials',visible:true,alert:'KFS Alert'});
      }
      else {
        const url1 = 'http://204.48.21.88:3000/create?mime='+this.state.mimeType+'&content=base64,'+this.state.base64content+
=======
      console.log(accounts[0]);
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
      const kfsAppsReplicated = await kfs.methods.getAppsOfOwner().call({from:this.state.sender});
        let pieSet1 = new Set();
        let kfsApps = [];
        let j1 = 0;
        for(let i=0;i<kfsAppsReplicated.length;i++)  {
            if(!pieSet1.has(kfsAppsReplicated[i].appName)) {
                kfsApps[j1] = kfsAppsReplicated[i];
                j1++;
                pieSet1.add(kfsAppsReplicated[i].appName);
            }
        }
        this.setState({ existingApps : kfsApps });
      let appNames = [];
      let appIds = [];
      const appsLength = kfsApps.length;
      if(appsLength!=0) {
        for(let i=0;i<appsLength;i++) {
          console.log(i);
           appNames[i] = kfsApps[i].appName; 
           appIds[i] = kfsApps[i].appID;
        }
        var bytes32Array = {};
        appIds.forEach((key, i) => bytes32Array[key] = appNames[i]);
        console.log(bytes32Array);

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

  mimCheck = (file) => {
    // const Unixfs = require('ipfs-unixfs')
    // const {DAGNode} = require('ipld-dag-pb')

    // const data = Buffer.from('hello world', 'ascii')
    // const unixFs = new Unixfs('file', data)
    // console.log(file);
    // DAGNode.create(unixFs.marshal(), (err, dagNode) => {
    //   if (err) return console.error(err)
    //   // console.log(dagNode.toJSON());
    //   console.log(dagNode.multihash);
    // })
    this.setState({uploadedFile : file});
  }

  // mimCheck = (file) => {
  //     if (file) {
  //       var reader = new FileReader();
  //         reader.onload = function(e) { 
  //           console.log(e.target.result); 
  //       }
  //       reader.readAsBinaryString(file);
  //     } else { 
  //       alert("Failed to load file");
  //     }
  //   }

  handleDismiss = () => {
    this.setState({ visible: false });
  }

  sendRequest = async () => {
      if(this.state.mimeType === '' || this.state.base64content === '' || this.state.receipent === '') {
        this.setState({hashMessage:'Please enter all the credentials',visible:true,alert:'KFS Alert'});
      }
      else  if(this.state.readNWrite) {
        if(this.state.selectApp === '') {
          this.setState({hashMessage:'Please choose App name',visible:true,alert:'KFS Alert'});
        }
        else {
              const updateURL = 'http://0.0.0.0:3000/update?appID='+this.state.selectApp+'&mime='+this.state.mimeType+'&content=base64,'+this.state.base64content+
              '&senderPub='+window.btoa(this.state.sender.toLowerCase())+'&reciPub='+window.btoa(this.state.receipent.toLowerCase());
              console.log(updateURL);
              axios.get(updateURL)
              .then( response => {
                if(response.data === 'false') {
                  console.log(response.data);
                  this.setState({hashMessage:'UnAuthorized Attempt',visible:true,alert:'KFS Alert'})
                }
                else {
                  console.log(response.data);
                  this.setState({open:true,hashMessage:response.data});
                }
              })
              .catch(error => {
                console.log(error);
                this.setState({hashMessage:'Error in sending request,Please check all the credentials or may be network is down',visible:true,alert:'KFS Alert'});
              });
            }
        }
      else {
        const url1 = 'http://0.0.0.0:3000/create?mime='+this.state.mimeType+'&content=base64,'+this.state.base64content+
>>>>>>> development
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
<<<<<<< HEAD
      console.log('coming')
      event.preventDefault();
      const data = new FormData();
      data.append('file', this.state.uploadedFile);
      data.append('senderPub', window.btoa(this.state.sender.toLowerCase()));
      data.append('reciPub', window.btoa(this.state.receipent.toLowerCase()));
      console.log(data);
      axios.post('http://204.48.21.88:3000/upload', data)
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
 
  saveToBC = async() => {
    console.log(kfs);
    try{
      await kfs.methods.saveFile(web3.utils.fromAscii(this.state.fileName),this.state.hashMessage).send({
        from: this.state.sender
      });
      this.setState({open:false,hashMessage:'Your File has been saved to Blockchain',visible:true,alert:'KFS Alert'})
=======
      if(this.state.receipent === '' || this.state.uploadedFile === '' || this.state.sender === '') {
        this.setState({hashMessage:'Please enter all the credentials',visible:true,alert:'KFS Alert'});
      }
      else if(this.state.readNWrite) {
        if(false) {
          this.setState({hashMessage:'Please enter file name',visible:true,alert:'KFS Alert'});
        }
        else {
          this.setState({uploading:true,open:true});
            const formData = new FormData();
            // let selectedWorkspace = web3.utils.hexToUtf8(this.state.appNames[this.state.selectApp]);
              formData.append('file', this.state.uploadedFile);
              formData.append('appName', this.state.selectApp.trim());
              formData.append('senderPub', window.btoa(this.state.sender.toLowerCase()));
              formData.append('reciPub', window.btoa(this.state.receipent.toLowerCase()));
              
              axios.post('http://0.0.0.0:3000/upload/update', formData)
              .then( response => {
                if(response.data === 'false') {
                  this.setState({hashMessage:'UnAuthorized Attempt',visible:true,alert:'KFS Alert'})
                }
                else {
                  this.setState({uploading:false,hashMessage:response.data,visible:false})
                }
              })
              .catch(error => {
                this.setState({open:false,visible:true,hashMessage:'Error in sending request, make sure receipent exists',visible:true,alert:'KFS Alert'});
              });
            }
          }
        else {
          this.setState({uploading:true,open:true});
          const data = new FormData();
          data.append('file', this.state.uploadedFile);
          data.append('senderPub', window.btoa(this.state.sender.toLowerCase()));
          data.append('reciPub', window.btoa(this.state.receipent.toLowerCase()));
          console.log(data);
          console.log()
          axios.post('http://0.0.0.0:3000/upload', data)
          .then( response => {
            if(response.data === 'false') {
              this.setState({hashMessage:'UnAuthorized Attempt',visible:true,alert:'KFS Alert'})
            }
            else {
              this.setState({open:false,uploading:false,hashMessage:'File stored successfully! with \n KFS FILE ID :'+response.data,visible:true,alert:'KFS Alert'})
            }
          })
          .catch(error => {
            this.setState({open:false,visible:true,hashMessage:'Error in sending request, make sure receipent exists and provided all the attributes',visible:true,alert:'KFS Alert'});
          });
        }
    }

  saveToBC = async() => {
    try{
      if(!this.state.readNWrite) {
        console.log(this.state.sender);
        await kfs.methods.createFile(web3.utils.fromUtf8(this.state.fileName),this.state.hashMessage,this.state.receipent).send({
          from: this.state.sender
        });
      }
      else {
        console.log(this.state.appNames);
        console.log(this.state.appNames[this.state.selectApp]+":"+this.state.hashMessage+":"+this.state.receipent);
        await kfs.methods.updateApp(this.state.appNames[this.state.selectApp],this.state.hashMessage,this.state.receipent).send({
          from: this.state.sender
        });
      }
      this.setState({open:false,hashMessage:'Your Transaction has been recorderd in Blockchain',visible:true,alert:'KFS Alert'})
>>>>>>> development
    }catch(e) {
      console.log(e);
    }
  }
<<<<<<< HEAD
=======


  FolderPrompt = () => {
    return (
      <div>
        <Radio toggle
          label='Move this file to a desired Workspace'
          onClick={() => 
            this.setState({readNWrite: !this.state.readNWrite})
          } 
          checked={this.state.readNWrite} />
            <br /><br />
        {this.state.readNWrite ? 
          // <Form.Field>
          //     <Dropdown className="form-control"  placeholder="Select Folder" value={this.state.selectApp}
          //   onChange={ (e,data) => this.setState({selectApp: data.value})}
          //   fluid selection options={this.state.existingApps} />
          // </Form.Field> 
          <Form.Field>
            <Input style={{ width: "100%" }} 
            name="appName"
            value={this.state.selectApp}
            onChange={event => this.setState({ selectApp: event.target.value})}
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
      </div>
    );
  }

>>>>>>> development
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
<<<<<<< HEAD
=======

>>>>>>> development
    return (
      <div className="App">
        <header className="App-header">
            <Grid style={{width:'500px'}}>
              <Grid.Row>
                <Grid.Column width={16}>   
                    <br /><br />
<<<<<<< HEAD
                    <Radio toggle
                      label={!this.state.checked ? 'Would like to send as file' : 'Would like to send as base64 content'}
                      onClick={() => 
                        this.setState({checked: !this.state.checked})
                      } 
                      checked={this.state.checked} />
                  
=======
                    {/* <Radio toggle
                      label='Send base64 content / Send a file'
                      onClick={() => 
                        this.setState({checked: !this.state.checked,visible:false,readNWrite:false,appID:'',hashMessage:''})
                      } 
                      checked={this.state.checked} /> */}
                  <br /><br />
>>>>>>> development
                  {!this.state.checked ? 
                  <Form>
                    <Form.Field>
                      <h4>Your address</h4>
                      <Input disabled size="large" style={{ width: "100%"}}
                        value={this.state.sender}      
                      />
                    </Form.Field>
                    <Form.Field>
<<<<<<< HEAD
                      <h4>Enter Receipent's address</h4>
                      <Input style={{ width: "100%" }} size="large"
                      value={this.state.receipent}
                      onChange={event => this.setState({ receipent: event.target.value})}
                      />
                    </Form.Field>            
=======
                        <h4>Select Recipient</h4>
                         <Dropdown className="form-control"  placeholder="Select Receipent" value={this.state.receipent}
                        onChange={ (e,data) => this.setState({receipent: data.value})}
                        fluid selection options={this.state.existingReceipents} />
                    </Form.Field>          
>>>>>>> development
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
<<<<<<< HEAD
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
=======
                    {this.FolderPrompt()}
                    <br/><Button loading={this.state.submitButton}  onClick={this.sendRequest} primary>Submit</Button>
                  </Form>
                :
                // file upload
                <Form encType="multipart/form-data" method="post">      
>>>>>>> development
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
<<<<<<< HEAD
                      onChange={ event => this.setState({uploadedFile : event.target.files[0]})}/>
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
                    <Message error header="Oops!" hidden={true} onDismiss={this.errorMessageDismiss} content={this.state.errorMessage} />
=======
                      onChange={ event => this.mimCheck(event.target.files[0])}/>
                    </Form.Field> 
                    {this.FolderPrompt()}
>>>>>>> development
                    <br/><Button onClick={this.handleUpload} primary>Submit</Button>
                  </Form>
                }
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </header>
<<<<<<< HEAD
        <Modal
          open={this.state.open}
          onClose={this.close}
        >
          <Modal.Header>Save File ID in Blockchain</Modal.Header>
          <Modal.Content>
            
            <Input style={{width:'70%'}} label="KFS File ID    " disabled type="text" value={this.state.hashMessage}/><br /><br />
            <Input style={{width:'70%'}} label="Enter File Name" 
            onChange={event => this.setState({fileName:event.target.value})} 
            value={this.state.fileName} type="text" placeholder="Enter file name to be saved with"/>
            <p>Are you sure you want to save your file id</p>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.close} negative>
              No
            </Button>
            <Button onClick={this.saveToBC} positive>
              Save
            </Button>
          </Modal.Actions>
        </Modal>
=======
        {this.state.uploading ? 
        <Modal
          open={this.state.open}
          onClose={this.close}
          size="mini"
        >
        <Modal.Header>Uploading to KFS ...</Modal.Header>
        <Modal.Content>
          <Image src={UploadingGIF} />
        </Modal.Content>
      </Modal> :
      <Modal
         open={this.state.open}
         onClose={this.close}
         size="small"
       >
       <Modal.Header>Do you want to Record this transaction in blockchain?</Modal.Header>
        <Modal.Content>
          <Input label='KFS FILE ID' placeholder={this.state.hashMessage} disabled/>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={()=>this.setState({ open: false })} color='red'> No </Button>
          <Button onClick={()=>{
            this.saveToBC();
          }} color='green'>Yes</Button>
        </Modal.Actions>
     </Modal>
    }
>>>>>>> development
      </div>
    );
  }
}
export default SenderView;