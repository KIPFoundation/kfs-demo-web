import React from 'react'
import { Button, Card,Popup ,Icon } from 'semantic-ui-react';
import web3 from './web3.js';

class AccountOptions extends React.Component {
  state = {
    accountLoggedIn: ''
  }
  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    this.setState({accountLoggedIn:accounts[0]});
  }
 
  render() {
    return (
      <Popup
        trigger={<Icon name='user circle' size="huge"/>}
        content={
          <Card style={{borderRadius:'0px',border:'0px'}}>
            <Card.Content>
              <Card.Header>Your Account</Card.Header>
              <Card.Meta style={{fontSize:'14px'}}>is identified By</Card.Meta>
              <Card.Description>
                <h4 style={{ width: '250px',wordWrap: 'break-word'}}>{this.state.accountLoggedIn}</h4>
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <center>
                <Button basic color='green'>
                  Sign Out
                </Button>
              </center>
            </Card.Content>
          </Card>
        }
        on='click'
        position='top right'
      />
    );
  }
}

export default AccountOptions;
