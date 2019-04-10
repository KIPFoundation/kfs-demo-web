import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import Dashboard from './newDashboard';
import WebExplorer from './Entry.js';
// import Block from './test.js';
// import SenderView from './Old_explorer/senderView';

import * as serviceWorker from './serviceWorker';

// ReactDOM.render(<SenderView />, document.getElementById('root'));
// ReactDOM.render(<Block />, document.getElementById('root'));

ReactDOM.render(<WebExplorer />, document.getElementById('root'));
serviceWorker.register();
