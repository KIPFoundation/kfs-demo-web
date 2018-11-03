import React, { Component } from 'react';
import { Button, Form, Input, Message, Grid , Image, Card } from 'semantic-ui-react';
import './App.css';
import web3 from './ethereum/web3.js';
import kfs from './ethereum/kfs.js';

class FilesView extends Component {

  constructor(props){
    super(props);
    this.state = {
      sender: '',
      hashMessage:'',
      receipent:'',
      realContent:'',
      source:'',
      visible:false,
      items: [],
      alert:''
    }
  }

  
  componentDidMount() {
    // const accounts=[];
    web3.eth.getAccounts().then((accounts, err) => {
      this.setState({receipent: accounts[0]}); 
    //   const items = responses.map(response => {
    //     return {
    //       header: response.fileName,
    //       description: response.kfsHash,
    //       fluid: true,
    //       style: { overflowWrap: 'break-word' }
    //     };
    //   });
    //   return <Card.Group items={items} />;   
        kfs.methods.getFilesStruct().call({ from: this.state.receipent }).then((responses, err) => {
            console.log(responses);
            const items = responses.map(response => {
                return {
                  header: web3.utils.hexToAscii(response.fileName),
                  description: response.kfsHash,
                //   meta: response.kfsHash,
                  fluid: true,
                  style: { overflowWrap: 'break-word' }
                };
              });

            this.setState({ items: items});
        });
    });
  }

  handleDismiss = () => {
    this.setState({ visible: false });
  }

  getContent = () => {
    
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
            <br /><br />
            <Grid style={{width:'500px'}}>
              <Grid.Row>
                <Grid.Column width={16}>
                <Card.Group items={this.state.items} />
                </Grid.Column>
            </Grid.Row>
          </Grid>
        </header>
      </div>
    );
  }
}

export default FilesView;
