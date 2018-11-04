import Web3 from 'web3';

let web3;

if(typeof window !== 'undefined' && typeof window.web3 !== 'undefined'){
  //We are in the browser and metamask is running
  web3 = new Web3(window.web3.currentProvider);
} else {
  // We are on the server *OR* the user is not running metamask
  // Private Network: 'http://159.65.80.74:8991/', 'http://142.93.177.142:8991/'
  const provider = new Web3.providers.HttpProvider(
    'http://159.65.80.74:8991/'
    // 'http://142.93.177.142:8991/'
  );
  web3 = new Web3(provider);
}

export default web3;
