import React from 'react'
import { Header, Icon } from 'semantic-ui-react'

const WelcomePage = () => (
  <div>
    <Header as='h2' icon textAlign='center'>
      <Icon name='users' circular />
      <Header.Content>KFS</Header.Content>
    </Header>
  </div>
)

export default WelcomePage;