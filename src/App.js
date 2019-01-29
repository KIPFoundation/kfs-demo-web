import React, { Component } from 'react';
import { Grid,Image } from 'semantic-ui-react';
// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import SenderView from './senderView';
import ReceiverView from './receiverView';
<<<<<<< HEAD
import FilesView from './filesView';
import Logo from './kipLogo.png';
=======
import FilesView from './kfsDrive.js';
import CreateApp from './createApp';
import Logo from './kipLogo.png';
import XmlForm from './xmlForm';
import Dashboard from './newDashboard.js';

>>>>>>> development

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      tab1:'black',
      tab2:'black',
<<<<<<< HEAD
      tab3: 'black'
=======
      tab3: 'black',
      tab4:'black',
      tab5:'black'
>>>>>>> development
    }
  }

  render() {
<<<<<<< HEAD
=======
    console.log(this.context.router);
>>>>>>> development
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
<<<<<<< HEAD
                <Grid.Column color={this.state.tab1} style={{borderRight:'1px solid white'}}><Link onClick={() => this.setState({tab1:'grey', tab2:'black', tab3:'black'})} to="/sender"><p className={this.state.tab1 === 'grey' ? 'active':'non-active'}>Sender's View</p></Link></Grid.Column>          
                <Grid.Column color={this.state.tab2} style={{borderRight:'1px solid white'}}><Link onClick={() => this.setState({tab2:'grey', tab3:'black', tab1:'black'})}  to="/receiver"><p className={this.state.tab2 === 'grey' ? 'active':'non-active'}>Receiver's View</p></Link></Grid.Column>
                <Grid.Column color={this.state.tab3} ><Link onClick={() => this.setState({tab3:'grey', tab1:'black', tab2:'black'})}  to="/files"><p className={this.state.tab3 === 'grey' ? 'active':'non-active'}>File Directory</p></Link></Grid.Column>
=======
                <Grid.Column color={this.state.tab1} style={{borderRight:'1px solid white'}}><Link onClick={() => this.setState({tab1:'grey', tab2:'black', tab3:'black',tab4:'black',tab5:'black'})} to="/sender"><p className={this.state.tab1 === 'grey' ? 'active':'non-active'}>Sender's View</p></Link></Grid.Column>          
                <Grid.Column color={this.state.tab2} style={{borderRight:'1px solid white'}}><Link onClick={() => this.setState({tab2:'grey', tab3:'black', tab1:'black',tab4:'black',tab5:'black'})}  to="/receiver"><p className={this.state.tab2 === 'grey' ? 'active':'non-active'}>Receiver's View</p></Link></Grid.Column>
                <Grid.Column color={this.state.tab3} style={{borderRight:'1px solid white'}}><Link onClick={() => this.setState({tab3:'grey', tab1:'black', tab2:'black',tab4:'black',tab5:'black'})}  to="/files"><p className={this.state.tab3 === 'grey' ? 'active':'non-active'}>File Directory</p></Link></Grid.Column>
                <Grid.Column color={this.state.tab4} style={{borderRight:'1px solid white'}}><Link onClick={() => this.setState({tab4:'grey', tab1:'black',tab2:'black', tab3:'black',tab5:'black'})} to="/createApp"><p className={this.state.tab4 === 'grey' ? 'active':'non-active'}>Create App</p></Link></Grid.Column>   
                <Grid.Column color={this.state.tab5} ><Link onClick={() => this.setState({tab5:'grey',tab4:'black', tab1:'black',tab2:'black', tab3:'black'})} to="/xmlForm"><p className={this.state.tab5 === 'grey' ? 'active':'non-active'}>Send as XML</p></Link></Grid.Column>                 
>>>>>>> development
                <Grid.Column></Grid.Column>
                <Grid.Column></Grid.Column>
              </Grid.Row>
            </Grid>
            <Route path="/sender" component={SenderView} />
            <Route path="/receiver" component={ReceiverView} />
            <Route path="/files" component={FilesView} />
<<<<<<< HEAD
=======
            <Route path="/createApp" component={Dashboard} />
            <Route path="/xmlForm" component={XmlForm} />
>>>>>>> development
          </div>
      </Router>
      </div>
    );
  }
}

export default App;
