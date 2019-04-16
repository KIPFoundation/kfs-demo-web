import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import WebExplorer from './Entry.js';

import * as serviceWorker from './serviceWorker';


ReactDOM.render(<WebExplorer />, document.getElementById('root'));
serviceWorker.register();
