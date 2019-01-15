import web3 from './web3';
import kfsContract from './build/KFSContract.json';

const instance = new web3.eth.Contract(
  JSON.parse(kfsContract.interface),
  
  //  '0x620c616B9f2c4CB0697B3CC6a6548935bCC41E23' // -- https://a0veaj9up1:ikr5_TjibloNaLf-AGkr2CBclqJnAcRMWe0wbQG6OXU@a0m04kiucb-a0ius3yioh-rpc.ap-southeast-2.kaleido.io
   '0x5fe9f11e5c6badbe1b5a12d29f48ce783c8e9a89' // -- http://142.93.251.210:8991/
  //  '0xfb5ada4ac273a679490519ad46bfe3562a30b7b3' // --  http://142.93.177.142:8991/
  //  '0xa4807e05e391946bd400be2ff6eba5e15be0b72d' // --  http://142.93.177.142:8991/ earlier working contract
);

export default instance;
