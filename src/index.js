import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import Dashboard from './newDashboard';
import WebExplorer from './Entry.js';
// import Block from './test.js';
// import Embed from './Explorer/Embed';

import * as serviceWorker from './serviceWorker';

// ReactDOM.render(<Embed />, document.getElementById('root'));
// ReactDOM.render(<Block />, document.getElementById('root'));

ReactDOM.render(<WebExplorer />, document.getElementById('root'));
serviceWorker.register();
