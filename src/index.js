import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Dashboard from './newDashboard';
// import WebExplorer from './explorer_old.js';
import * as serviceWorker from './serviceWorker';

// ReactDOM.render(<WebExplorer />, document.getElementById('root'));
ReactDOM.render(<Dashboard />, document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
