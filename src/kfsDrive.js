import React from 'react'
import { Button, Card, Image } from 'semantic-ui-react';
import axios from 'axios';
import web3 from './ethereum/web3.js';
import loadingGIF from './loader.gif';
import kfs from './ethereum/kfs.js'
class FilesView1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filesExisting : [],
      imageContent:false,
      plainContent:false,
      content:'',
      source:'',
      receipent:'',
      loading:false,
      isEmpty:false,
      videoBoolean:false,
      VideoSource:'',
      xml:''
    }
  }
  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    this.setState({receipent: accounts[0]});  
    this.renderFiles();
  }

  renderData = (kfsHash,id) => {
    this.setState({loading:true,source:'',xml:'',content:''});
    let url = '';
    if(id == 1) {
      url = 'http://0.0.0.0:3000/appdata/'+kfsHash+'?reciPub='+window.btoa(this.state.receipent.toLowerCase());
    }
    else {
      url = 'http://0.0.0.0:3000/read/'+kfsHash+'?reciPub='+window.btoa(this.state.receipent.toLowerCase());
    }
    console.log(url);
    axios.get(url)
      .then( response => {
        const returnType = response.headers['content-type'];
        console.log(returnType);
          if(returnType == 'text/plain' || returnType == 'text/html') {
            this.setState({content:response.data,plainContent:true,imageContent:false,loading:false});
          }
          else if(returnType == 'image/jpeg' || returnType == 'image/jpg' || returnType == 'image/png' || returnType == 'image/gif') {
            // this.setState({source:url,imageContent:true,plainContent:false,loading:false});
            this.setState({source:url,imageContent:true,plainContent:false,loading:false});
          }
          else {
            if(returnType == 'text/xml; charset=utf-8') {
              this.setState({xml : response.data , loading:false});
            }
            else if(returnType == 'video/mp4') {
              this.setState({VideoSource:url,videoBoolean:true,loading:false});
            }
            else {
             console.log(response.data);
            }
          }
      })
      .catch((error) => {
        console.log(error);
    });
  }

  renderFiles = async () => {
    const accounts = await web3.eth.getAccounts();
    let kfsFilesDup = await kfs.methods.getFilesOfOwner().call({from:accounts[0]});    let pieSet = new Set();
    let kfsFiles = [];
    let j = 0;
    for(let i=0;i<kfsFilesDup.length;i++)  {
      if(!pieSet.has(kfsFilesDup[i])) {
        kfsFiles[j] = kfsFilesDup[i];
        j++;
        pieSet.add(kfsFiles[i]);
      }
    }
    let files = [];
    const kfsFilesLength = kfsFiles.length;
    for(let i=0;i<kfsFilesLength;i++) {
      files[i] = (
        <Card key={i}>
          <Card.Content>
            <Card.Header>{web3.utils.hexToUtf8(kfsFiles[i].fileName)}</Card.Header>
            <Card.Meta>{kfsFiles[i].kfsHash}</Card.Meta>
          </Card.Content> 
          <Card.Content extra>
            <div className='ui two buttons'>
              <Button basic color='green'
                onClick={() => {this.renderData(kfsFiles[i].kfsHash,2)}} >
                Fetch
              </Button>
              <Button basic color='black'
                onClick={() => {
                  window.location = 'http://0.0.0.0:3000/ipfs/'+kfsFiles[i].kfsHash;
                }} >
                Open In Gateway
              </Button>
            </div>
          </Card.Content>
        </Card>
      );
    }

    const kfsAppsDup = await kfs.methods.getAppsOfOwner().call({from:accounts[0]});
    let pieSet1 = new Set();
    let kfsApps = [];
    let j1 = 0;
    for(let i=0;i<kfsAppsDup.length;i++)  {
      if(!pieSet1.has(kfsAppsDup[i].appName)) {
        kfsApps[j1] = kfsAppsDup[i];
        j1++;
        pieSet1.add(kfsAppsDup[i].appName);
      }
    }
    for(let i=0;i<kfsApps.length;i++) {
      const previousHashes = await kfs.methods.checkAppPreviousHashes(kfsApps[i].appName).call({from:accounts[0]});
      const Description = previousHashes.map(hash => {
       return (<div> {hash} </div>);
      });
      files[i+kfsFilesLength] = (
        <Card key={i+kfsFilesLength}>
          <Card.Content>
            {/* <p style={{float:'right'}}>23-Nov-2018</p> */}
            <Card.Header>{web3.utils.hexToUtf8(kfsApps[i].appName)}</Card.Header>
            <Card.Meta>{kfsApps[i].appID}</Card.Meta>
            <Card.Description>
              <h4>Audit Trail (State Hashes)</h4>
              {Description}
            </Card.Description>
          </Card.Content> 
          <Card.Content extra>
            <div className='ui one buttons'>
              <Button basic color='green'
                onClick={() => {this.renderData(kfsApps[i].appID,1)}}>
                Fetch
              </Button>
            </div>
          </Card.Content>
        </Card>
      );
    }
    if(files.length == 0) {
      this.setState({isEmpty : true});
    }
    else {
      this.setState({filesExisting : files});
    }
  }

render() {
  return (
    <div>
    {this.state.isEmpty ? <center style={{backgroundColor:'#ffffff'}}><h1 style={{color:'black',paddingTop:'20%'}}>Your Directory is Empty</h1></center> : 
    <div style={{display:'flex',height:'700px',backgroundColor:'#ffffff',paddingLeft:'100px'}}>
      <div style={{overflow:'auto',margin:'4% 20% 1% 4%',width:'35%',paddingTop:'5px'}}>
        <Card.Group itemsPerRow="1">
          {this.state.filesExisting}
        </Card.Group>
      </div>
      <div style={{margin:'4% 1% 2% -5%',padding:'2%',width:'40%',backgroundColor:'#000000'}}>
        {this.state.loading ? 
              <div>
                <center>
                  <img height="150px" width="150px;" style={{marginTop : '100px'}} src={ loadingGIF } />
                </center>
              </div>
        : 
        <div>
        {this.state.imageContent ? <Image style={{width:'100%'}} src={this.state.source} /> : <span style={{color:'#ffffff'}}>Fetched Content will be appearing here!</span>}
        {this.state.plainContent ? 
          <div style={{backgroundColor:'#ffffff',padding:'2%'}}>
            <center><h2>File Content</h2></center>
            <div style={{margin:'2%'}}>{this.state.content}</div>
          </div> : ''}
          {this.state.xml!=='' ? 
          <div style={{backgroundColor:'#ffffff',padding:'2%'}}>
              <center><h2>XML Content</h2></center>
              <div style={{margin:'2%'}}>
                <xmp>
                  {this.state.xml}
                </xmp>
              </div>
          </div> : ''}
          {this.state.videoBoolean? <video width="100%" height="400" controls>
                                               <source src={this.state.VideoSource} type="video/mp4" />
                                                Your browser does not support the video tag.
                                              </video> :''}
        </div>
        }
      </div>
    </div>}
    </div>
  )}
}

export default FilesView1;

// video/mp4