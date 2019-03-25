import React from 'react';
import Web3 from 'web3';
import {Input,Button,List,Label} from 'semantic-ui-react';
import EthereumTx from 'ethereumjs-tx';
import abi from './assets/abi.json';
// let passphrase;
// const { generateKeyPairSync } = require('crypto');
// const crypto = require('crypto');
// crypto.pbkdf2('secret', 'salt',20004, 128, 'sha512', (err, derivedKey) => {
//     if (err) throw err;
//     console.log(derivedKey.toString('hex'));
//     // console.log(passphrase);
//   });

const web3 = new Web3(new Web3.providers.HttpProvider('http://142.93.251.210:8991'));
const address = '0x36fedee4b2d5651bb6db6b1f5f8f99ca82e8d1fa';
const contractInstance = new web3.eth.Contract(JSON.parse(abi.interface),address);

export default class Block extends React.Component {
    state = {
        blockNumber : '',
        publicKey:'',
        privateKey:'',
        accountDetails:''
    }
    async componentDidMount() {
        this.setState({ blockNumber : await web3.eth.getBlockNumber() });
    }
    recoverAccount = async () => {
        const key = await web3.eth.accounts.privateKeyToAccount('0x'+this.state.privateKey);
        this.setState({ publicKey : key.address});
    }
    createCustomAccount = async () => {
        const details = await web3.eth.accounts.create(web3.utils.randomHex(32));
        console.log(details);
        this.setState({accountDetails : {address:details.address,privateKey:details.privateKey} })
    }
    commitFund = () => {
        try {
            const account = "0x664f3AAE10020BCc201CaaCE4394A93191E487f3";
            const privateKey = Buffer.from('c292a2b324b1c18bf2eea4e0c6db3ba7438a72c741f102241634f610337fe0f0', 'hex');
            web3.eth.getTransactionCount(account, async function (err, nonce) {
                let data = await contractInstance.methods.commitFund(web3.utils.fromAscii('BETA FUND - 20'),100).encodeABI();
                let gasPrice = await contractInstance.methods.commitFund(web3.utils.fromAscii('BETA FUND - 20'),100).estimateGas({ from: account });
                var tx = new EthereumTx({
                    nonce: nonce,
                    gasPrice: gasPrice,
                    gasLimit: 1000000,
                    to: address,
                    value: 0,
                    data: data,
                });
                tx.sign(privateKey);
                var signedTxData = '0x' + tx.serialize().toString('hex');
                web3.eth.sendSignedTransaction(signedTxData, function (err, transactionHash) {
                    console.log(transactionHash);
                    console.log(err);
                });
            });
        } catch(err){
            console.log(err)
        }
    }
    render() {
        return (
            <div style={{margin:'30px 50px 0px 50px'}}>
                <h1>Block Number : {this.state.blockNumber} </h1><br />
                <h2>Import Account :</h2>
                <Input action={<Input type="submit" onClick={() => this.recoverAccount()} primary="true"/>} 
                       style={{width:'40%'}} 
                       type="text" 
                       placeholder="Enter Private Key" 
                       onChange={(e) => this.setState({privateKey : e.target.value})} />
                <br />
                {
                 this.state.publicKey !== '' ? 
                    <h2>Yay! you have been identified with : {this.state.publicKey}</h2> : ''
                }
                <br />
                <hr />
                <Button onClick={() => this.createCustomAccount()} primary>
                    Create Account
                </Button>
                <br /><br />
                <Button onClick={() => this.commitFund()}
                    primary>Commit Fund</Button>
                {this.state.accountDetails !== '' ?
                <React.Fragment>
                    <h3>Details of Account being created</h3>
                    <List style={{width:'50%'}} divided>
                        <List.Item>
                            <Label horizontal>Address</Label>
                            {this.state.accountDetails.address}
                        </List.Item>
                        <List.Item>
                            <Label horizontal>Private Key</Label>
                            {this.state.accountDetails.privateKey}
                        </List.Item>
                    </List>
                </React.Fragment> : ""}
            </div>
        )
    }
}