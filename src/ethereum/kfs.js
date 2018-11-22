import web3 from './web3';
import kfsContract from './build/KFSContract.json';

const instance = new web3.eth.Contract(
  JSON.parse(kfsContract.interface),
   '0x288a96920d4610a9f13b56c1a49749829446ff76' // -- http://142.93.251.210:8991/
);

export default instance;
