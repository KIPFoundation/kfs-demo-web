import React from 'react'
import { Button, Card, Image } from 'semantic-ui-react'

const CardExampleGroups = () => (
  <div style={{display:'flex'}}>
    <Card.Group itemsPerRow="1" style={{overflow:'auto',margin:'4% 20% 1% 4%',width:'35%'}}>
    <Card>
      <Card.Content>
        <p style={{float:'right'}}>23-Nov-2018</p>
        <Card.Header>KFS FILE ID</Card.Header>
        <Card.Meta>QmZNg9HvgkB39eYj2349t8vZmF4zumpawh3MRE3WBocRTr</Card.Meta>
      </Card.Content> 
      <Card.Content extra>
        <div className='ui one buttons'>
          <Button basic color='green'>
            Fetch
          </Button>
        </div>
      </Card.Content>
    </Card>
    <Card>
      <Card.Content>
        <p style={{float:'right'}}>23-Nov-2018</p>
        <Card.Header>KFS FILE ID</Card.Header>
        <Card.Meta>QmZNg9HvgkB39eYj2349t8vZmF4zumpawh3MRE3WBocRTr</Card.Meta>
      </Card.Content> 
      <Card.Content extra>
        <div className='ui one buttons'>
          <Button basic color='green'>
            Fetch
          </Button>
        </div>
      </Card.Content>
    </Card>
    <Card>
      <Card.Content>
        <p style={{float:'right'}}>23-Nov-2018</p>
        <Card.Header>KFS FILE ID</Card.Header>
        <Card.Meta>QmZNg9HvgkB39eYj2349t8vZmF4zumpawh3MRE3WBocRTr</Card.Meta>
      </Card.Content> 
      <Card.Content extra>
        <div className='ui one buttons'>
          <Button basic color='green'>
            Fetch
          </Button>
        </div>
      </Card.Content>
    </Card>
  </Card.Group>
  <div style={{backgroundColor:'#ffffff',margin:'4% 1% 2% 0%',padding:'2%',width:'35%'}}>
  You will see fetched data here
  </div>
  </div>
)

export default CardExampleGroups