import web3 from './web3';
import kfsContract from './build/KFSContract.json';

const instance = new web3.eth.Contract(
  JSON.parse(kfsContract.interface),
   '0x61287cc07c79be9e3b6ffda4755fcbd6babd3368' // -- http://142.93.251.210:8991/
);

export default instance;
