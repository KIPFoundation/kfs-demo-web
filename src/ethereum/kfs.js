import web3 from './web3';
import kfsContract from './build/KFSContract.json';

const instance = new web3.eth.Contract(
  JSON.parse(kfsContract.interface),
  
  //  '0x620c616B9f2c4CB0697B3CC6a6548935bCC41E23' // --  https://a0veaj9up1:ikr5_TjibloNaLf-AGkr2CBclqJnAcRMWe0wbQG6OXU@a0m04kiucb-a0ius3yioh-rpc.ap-southeast-2.kaleido.io
  //  '0x0433848679e803f0e7a12114356c9b3d7822195c' // --  http://142.93.251.210:8991/
  //  '0x3062c7f29e174a0b25b9d5abe3696cffeb3b2080' // --  http://142.93.251.210:8991/ -- previously working contract
   '0x7d3bd4a03c43063d83c2c95a008f1f64cf41a4f5' // -- fresh state for remove
  //  '0xa4807e05e391946bd400be2ff6eba5e15be0b72d' // --  http://142.93.177.142:8991/ earlier working contract
);

export default instance;
