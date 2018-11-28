import web3 from './web3';
import kfsContract from './build/KFSContract.json';

const instance = new web3.eth.Contract(
  JSON.parse(kfsContract.interface),
   '0xbdac547421c8e5292f385f3dc825a78760b1efe8' // -- http://142.93.251.210:8991/
  //  '0xfb5ada4ac273a679490519ad46bfe3562a30b7b3' // --  http://142.93.177.142:8991/
);

export default instance;
