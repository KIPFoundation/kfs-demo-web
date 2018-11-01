import web3 from './web3';
import kfsContract from './build/KFSContract.json';

const instance = new web3.eth.Contract(
  JSON.parse(kfsContract.interface),
   '0x692a70d2e424a56d2c6c27aa97d1a86395877b3a' // -- http://159.65.80.74:8991/
);

export default instance;
