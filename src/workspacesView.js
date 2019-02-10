import React, { Component } from 'react';
import './App.css';
import { Card } from 'semantic-ui-react';

class WorkspacesView extends Component {
  render() {
    console.log(this.props.content);
    return (
      <div>
        <Card.Group>
            <Card fluid color='red' header='Option 1' />
            <Card fluid color='orange' header='Option 2' />
            <Card fluid color='yellow' header='Option 3' />
        </Card.Group>
      </div>
    )
  }
}

export default WorkspacesView;
