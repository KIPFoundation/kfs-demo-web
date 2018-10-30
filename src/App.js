import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import SenderView from './senderView';
import ReceiverView from './receiverView';
class App extends Component {

  constructor(props){
    super(props);
    this.state = {
    }
  }

  render() {
    return (
        <div>
        <h1>KFS DEMO</h1>
            <Router>
            <div>
                <ul>
                    <li>
                    <Link to="/sender">View as Sender</Link>
                    </li>
                    <li>
                    <Link to="/receiver">View as Receiver</Link>
                    </li>
                </ul>
                <Route path="/sender" component={SenderView} />
                <Route path="/receiver" component={ReceiverView} />
            </div>
        </Router>
      </div>
    );
  }
}

export default App;
