import web3 from './web3';
import kfsContract from './build/KFSContract.json';

const instance = new web3.eth.Contract(
  JSON.parse(kfsContract.interface),
   '0x640e5929d9e5ea03005e70e86966177951e9309a' // -- http://142.93.251.210:8991/
  //  '0xfb5ada4ac273a679490519ad46bfe3562a30b7b3' // --  http://142.93.177.142:8991/
);

export default instance;
