import web3 from './web3';
import kfsContract from './build/KFSContract.json';

const instance = new web3.eth.Contract(
  JSON.parse(kfsContract.interface),
  //  '0x414db2c0103d7869ecdfdbc8ce45aaa913970a1c' // -- http://159.65.80.74:8991/
   '0xc0b901c093a0280feac6dd7265bab606a8474c9e' // -- http://159.65.80.74:8991/
);

export default instance;