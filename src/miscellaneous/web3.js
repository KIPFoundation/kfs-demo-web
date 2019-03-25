import Web3 from 'web3';
let web3;

if(typeof window !== 'undefined' && typeof window.web3 !== 'undefined'){
  //We are in the browser and metamask is running
  web3 = new Web3(window.web3.currentProvider);
} else {
  console.log('No web3? You should consider trying MetaMask!')
  // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
  // web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

export default web3;
