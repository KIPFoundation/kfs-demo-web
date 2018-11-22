import web3 from './web3';
import kfsContract from './build/KFSContract.json';

const instance = new web3.eth.Contract(
  JSON.parse(kfsContract.interface),
   '0x384158df9c879b87b1216bd8e341de3e77d6b366' // -- http://142.93.251.210:8991/
);

export default instance;
