import web3 from './web3';
import kfsContract from './build/KFSContract.json';

const instance = new web3.eth.Contract(
  JSON.parse(kfsContract.interface),
   '0xfc2e911b43e4b7c763071195db8d9c4c02fd4ad0' // -- http://142.93.251.210:8991/
);

export default instance;
