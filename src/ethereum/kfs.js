import web3 from './web3';
import kfsContract from './build/KFSContract.json';

const instance = new web3.eth.Contract(
  JSON.parse(kfsContract.interface),
   '0x9985fcd7020bff29e13c3d56ccedbd65e792ef55' // -- http://142.93.251.210:8991/
);

export default instance;
