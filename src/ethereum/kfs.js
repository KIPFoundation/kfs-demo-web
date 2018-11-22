import web3 from './web3';
import kfsContract from './build/KFSContract.json';

const instance = new web3.eth.Contract(
  JSON.parse(kfsContract.interface),
   '0xda845d02faa8a06ae83e9d1056e529505378c5e2' // -- http://142.93.251.210:8991/
);

export default instance;
