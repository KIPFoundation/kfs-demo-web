import React, { Component } from 'react';
import { Grid,Image } from 'semantic-ui-react';
// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import SenderView from './senderView';
import ReceiverView from './receiverView';
import Logo from './kipLogo.png';
class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      tab1:'black',
      tab2:'black'
    }
  }

  render() {
    return (
        <div style={{backgroundColor:"black"}}>
          <div>
            <Image style={{height:"50px",width:"150px"}} src={Logo} avatar />
          </div>
        <center>
          <h1 style={{color:'white'}}>KFS DEMO</h1>
        </center>
        <Router>
          <div>
            <Grid columns='equal' padded>
              <Grid.Row color='black' textAlign='center'>
                <Grid.Column></Grid.Column>
                <Grid.Column></Grid.Column>
                <Grid.Column color={this.state.tab1} style={{borderRight:'1px solid white'}}><Link onClick={() => this.setState({tab1:'grey',tab2:'black'})} to="/sender"><p className={this.state.tab1 === 'grey' ? 'active':'non-active'}> View as Sender</p></Link></Grid.Column>          
                <Grid.Column color={this.state.tab2}><Link onClick={() => this.setState({tab2:'grey',tab1:'black'})}  to="/receiver"><p className={this.state.tab2 === 'grey' ? 'active':'non-active'}>View as Receiver</p></Link></Grid.Column>
                <Grid.Column></Grid.Column>
                <Grid.Column></Grid.Column>
              </Grid.Row>
            </Grid>
            {/* <Grid style={{width:'300px',margin}} columns={2} padded>
                <Grid.Column><Link to="/sender">View as Sender</Link></Grid.Column>                
                <Grid.Column><Link to="/receiver">View as Receiver</Link></Grid.Column>
            </Grid> */}
            <Route path="/sender" component={SenderView} />
            <Route path="/receiver" component={ReceiverView} />
          </div>
      </Router>
      </div>
    );
  }
}

export default App;
