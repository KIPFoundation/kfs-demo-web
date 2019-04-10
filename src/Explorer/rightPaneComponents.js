import React from 'react';
import "../assets/css/rightComponent.css";
import {Header,Icon,Card,Input,Button,Popup,Label,Menu} from 'semantic-ui-react';
import axios from 'axios';
import web3 from '../miscellaneous/web3';
class RightPaneComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isCreateSharedFolderClicked:true,
            isOpen:false,
            creatingFolder:false,
            folderName:'',
            responseInCreatingFolder:'',
            buttonAcknowledgement:'Create',
            uploadnShareAction:'off',
            fileSelected:'',
            loggedInUser:'',
            selectApp:'',
            fileUploadedObject:{
                status:false,
                message:'',
                color:'black'
            }
        }
    }
    async componentDidMount() {
        let account = await web3.eth.getAccounts();
        account = account[0].toLowerCase();
        this.setState({ loggedInUser:window.btoa(account)});
    }
    
    createSharedFolderAction = () => {
        if(this.state.buttonAcknowledgement === 'Done') {
            this.setState({responseInCreatingFolder:'',isOpen:false,buttonAcknowledgement:'Create',creatingFolder:false});
            this.props.refreshDrive({});
        }
        this.setState({creatingFolder:true});
        const appIdUrl = 'http://35.200.183.53:3000/createAppID/'+this.state.folderName.trim()+'?sender='+this.state.loggedInUser;
        console.log(appIdUrl);    
        axios({
            method:'get',
            url: appIdUrl,
            auth: {
                username : 'qwerty',
                password: '123456'
            }
        })
        .then( response => {
            console.log(response.data);
            if(response.data === 'An app already exist by this name') {
                this.setState({creatingFolder:false,buttonAcknowledgement:'Done',responseInCreatingFolder:'Folder with name '+this.state.folderName+' already exists'});
            }
            else {
                this.setState({creatingFolder:false,buttonAcknowledgement:'Done',responseInCreatingFolder:'Folder with name '+this.state.folderName+' created successfully'});
            }
        })
        .catch(error => {
            console.log(error);
            this.setState({creatingFolder:false,responseInCreatingFolder:'Error in creating folder'});
        });
    }
    uploadFolderHandler = (event) => {
        let filesUploaded = event.target.files;
        let filesSelected = [];
        for(let i=0;i<filesUploaded.length;i++) {
            if(filesUploaded[i].name !== '.DS_Store') {
                filesSelected.push(filesUploaded[i]);
            }
        }
        this.setState({fileSelected : filesSelected,uploadnShareAction:'show'});
    }
    uploadRUpdate = (shareAttributes,type) => {
        this.setState({uploadnShareAction : 'on'});
        let url='';
        let formData = new FormData();
        formData.append('senderPub',this.state.loggedInUser);
        formData.append('reciPub',shareAttributes.boolean ? shareAttributes.receipentAddress : this.state.loggedInUser);
        if(type === 1) {
            url = 'http://35.200.183.53:3000/upload';
            formData.append('file', this.state.fileSelected);
        }
        else if(type === 2) {
            url = 'http://35.200.183.53:3000/upload/update';
            formData.append('file', this.state.fileSelected);
            formData.append('appName',this.props.pwdAttributes.kfsName);
        }
        else if(type === 3) {
            url = 'http://35.200.183.53:3000/uploadfolder';
            const array = this.state.fileSelected;
            for(let i=0;i<array.length;i++) {
                formData.append('multiplefiles',array[i]);
            }
        }
        else {
            url = 'http://35.200.183.53:3000/updatefolder';
            const array = this.state.fileSelected;
            for(let i=0;i<array.length;i++) {
                formData.append('multiplefiles',array[i]);
            }
            formData.append('appName',this.props.pwdAttributes.kfsName);
        }
        console.log(url);
        console.log(formData.get('senderPub'));
        console.log(formData.get('reciPub'));
        console.log(formData.get('multiplefiles'));

        axios({
            method:'post',
            url: url,
            auth: {
                username : 'qwerty',
                password: '123456'
            },
            data : formData,
            config: { headers: {'Content-Type': 'multipart/form-data' }}
        })
        .then( response => {
            console.log(response);
            if(response.data === 'file already exists') {
                const fileUploadedObject = {
                    status : true,
                    color:'blue',
                    message : 'File already exists'
                }
                this.setState({uploadnShareAction:'show',fileUploadedObject:fileUploadedObject});
            }
            else {
                const fileUploadedObject = {
                    status : true,
                    color:'green',
                    message : type === 3 || type === 4 ? 'Folder Uploaded!' : 'File Uploaded'
                }
                this.setState({uploadnShareAction:'show',fileUploadedObject:fileUploadedObject});
            }
        })
        .catch(error => {
            console.log(error);
            const fileUploadedObject = {
                status : true,
                color:'red',
                message : 'Error in uploading!'
            }
            this.setState({uploadnShareAction:'show',fileUploadedObject:fileUploadedObject});
        });
    }
    
    render() {
        function getNameNCount(array) {
            if(array[0] !== undefined)
                return array[0].webkitRelativePath.split('/')[0]+' ( '+array.length+' files)';
        }
        const freshUploadObject  = {
            status : false,
            message : '',
            color:'red'
        }
        return (
            <div style={{marginTop:'20%',paddingLeft:'10%'}}>
                <div className="file-input-wrapper">
                    <div className="btn-file-input">
                        <Icon size="large" name='upload' />
                        <div style={{margin:'0% 0px 0px 2.7%'}}>Upload File</div>
                    </div>
                    <input type="file" name="file" 
                        onChange={(event) => this.setState({fileSelected : event.target.files[0],uploadnShareAction:'show'})
                        }/>
                </div>
                <Popup style={{padding:'0px'}}
                    trigger = {
                        <div className={this.state.isOpen? "new-shared-folder-clicked" : "new-shared-folder"}>
                                <Icon size="large" name='add' />
                                <div style={{margin:'0% 0px 0px 2.7%'}}>New Folder</div>
                        </div>
                    }
                    content={
                    <Card style={{padding:'3%'}}>
                        <Card.Content>
                            <Card.Header style={{cursor:'pointer',float:'right',fontSize:'24px'}} onClick={() => this.setState({fileUploadedObject:freshUploadObject,isOpen:false,responseInCreatingFolder:'',buttonAcknowledgement:'Create',creatingFolder:false}) }>&times;</Card.Header>
                            <Card.Header>New Folder</Card.Header>
                            </Card.Content>
                        <Card.Content>
                        <Input style={{width:'100%'}} placeholder="Enter name"
                            onChange={(e) => this.setState({folderName:e.target.value})} />
                        <p className={
                                this.state.responseInCreatingFolder !== '' ?
                                this.state.responseInCreatingFolder !== "Error in creating folder" ? "positive-response" :"negative-response"
                                :"dontShow"
                            }>
                            {this.state.responseInCreatingFolder}
                        </p>
                        <Button loading={this.state.creatingFolder} 
                            onClick={() => this.createSharedFolderAction()}
                            style={{margin:'4% 0% 0% 30%'}} primary>{this.state.buttonAcknowledgement}
                        </Button> 
                        </Card.Content>
                    </Card>
                    }
                    on='click'
                    open={this.state.isOpen}
                    onOpen={() => this.setState({ isOpen: true })}
                    position='left center'
                />
                
                <div className="file-input-wrapper">
                    <div className="btn-file-input">
                        <Icon size="large" name='folder' />
                        <div style={{margin:'0% 0px 0px 2.7%'}}>Upload Folder</div>
                    </div>
                    <input directory="" webkitdirectory="" type="file" onChange={(e) => this.uploadFolderHandler(e)} />                     
                </div>
                 <div className={this.state.uploadnShareAction !== 'off' ? "modal-for-uploading" : "dontShow"}>
                    <center>
                    <div className="upload-n-share">
                        <div className={this.state.uploadnShareAction === "on" ? "header_lesser-brighter":"uploading_modal_header"}>
                            {this.state.fileSelected.length !== undefined ?
                                <div>Folder Selected : <b><i>{getNameNCount(this.state.fileSelected)}</i></b></div> 
                                :
                                <div>File Selected : <b><i>{this.state.fileSelected.name}</i></b></div>
                            }
                            <div 
                                style={{cursor:'pointer',position:'absolute',right:'6%',fontSize:'24px'}}
                                onClick={()=>this.setState({uploadnShareAction:"off"})}>&times;
                            </div>
                        </div>
                        <div className={this.state.uploadnShareAction === "on" ? "sharing-bar":"dontShow"}></div>
                        <UploadOptionsModal 
                            triggerUploadRUpdate={(shareAttributes,type) => this.uploadRUpdate(shareAttributes,type)}
                            makeItLesserBright = {this.state.uploadnShareAction === "on" ? true : false}
                            fileUploaded = {this.state.fileUploadedObject}
                            currentDAttritubes = {this.props.pwdAttributes}
                            isFolder = {this.state.fileSelected.length !== undefined ? true : false}
                            triggerRefresh = {() => {
                                this.setState({uploadnShareAction : 'off',fileUploadedObject:freshUploadObject})                                
                                this.props.refreshDrive({}) }
                            }
                            triggerRefreshOfFolder = {()=> {
                                this.setState({uploadnShareAction : 'off',fileUploadedObject:freshUploadObject})
                                this.props.refreshOpenedFolder(this.props.pwdAttributes) }
                            }
                        />
                    </div> 
                    </center>
                </div>
            </div>
        )
    }
}
export default RightPaneComponent;

class UploadOptionsModal extends React.Component {
    state = {
        saveOptionClicked : false,
        addOptionClicked : false,
        dontWannaShare:false,
        enableNotAllowedLabel:'disable',
        receipentAddress:''
    }
    render() {
        const hide = {display:'none'};
        const showInput = {width:'80%',fontSize:'10px',marginBottom:'2%',opacity:1};
        // const showInputWithLessOpacity = {width:'80%',fontSize:'10px',marginBottom:'2%',opacity:0.2,pointerEvents: 'none'};
        const show = {display:'block'};
        return (
            <React.Fragment>
                {/* <div className={!this.state.saveOptionClicked && !this.state.addOptionClicked? "options_container" : "dontShow"}>
                    <Button style={{width:'100%',color:'white',backgroundColor:'#3B5998',border:'0px',fontSize:'12px'}} 
                        content='Save to KFS Drive' 
                        icon='save' 
                        size="medium"
                        labelPosition='left' 
                        onClick={() => this.setState({saveOptionClicked : true})}/>
                    <div style={{display:'flex',flexDirection:'row',opacity:'0.4',margin:'4%'}}>
                        <div style={{width:'45%'}}><hr /> </div>
                        <div style={{width:'10%',textAlign:'center',marginTop:'-2%',fontSize:'12px'}}>Or</div>
                        <div style={{width:'45%'}}><hr /></div>
                    </div>
                    <Button style={{width:'100%',backgroundColor:'#4875B4',color:'white',border:'0px',fontSize:'12px'}} 
                        content='Add to Folder' 
                        icon='add' 
                        size="medium"
                        labelPosition='left' 
                        onClick={() => this.setState({addOptionClicked : true})} />
                </div>  */}
                {/* Save Option Body */}
                <div className={this.props.currentDAttritubes.name === 'explorer' && !this.props.fileUploaded.status ? 'showItNow' : 'dontShow'}>
                    <div className="save_option_header">
                        <Icon name='save'
                            style={{backgroundColor:'transparent',cursor:'pointer',float:'left',fontSize:'20px',border:'0px'}}
                        />
                        <div>Save to KFS Drive</div>
                    </div>
                    <div style={{fontSize:'12px',marginBottom:'2%'}}>
                        <input type="checkbox" checked={this.state.dontWannaShare}
                            onChange={() => this.setState({dontWannaShare:!this.state.dontWannaShare})}/>
                            <span style={{marginLeft:"1%"}}>i don't want to share this file with anyone</span>
                    </div>
                    <Input style={this.state.dontWannaShare ? hide : showInput } 
                            labelPosition='right' placeholder='Enter receipent Address'  type='text' 
                            onChange={(e)=>{
                                this.setState({receipentAddress:e.target.value})}
                            }
                            value={this.state.receipentAddress}
                            onFocus={()=>this.setState({enableNotAllowedLabel : 'disable'})}>
                        <Label style={{backgroundColor:'#3B5998',color:'#fbfbfb'}} basic>Share With : </Label>
                        <input />
                        <Label size="tiny" color="red" style={this.state.enableNotAllowedLabel === 'enable' ? show : hide } pointing="left">Please enter a value</Label>
                    </Input>
                    <center>
                        <Button size="tiny" color="facebook" 
                        disabled = {this.props.makeItLesserBright}
                        onClick={()=> {
                            if(!this.state.dontWannaShare) {
                                if(this.state.receipentAddress === '') {
                                    this.setState({enableNotAllowedLabel:'enable'})
                                }
                                else {
                                    if(this.props.isFolder) {
                                        this.props.triggerUploadRUpdate({boolean:true,receipentAddress : window.btoa(this.state.receipentAddress.toLocaleLowerCase())},3)                                        
                                    }
                                    else {
                                        this.props.triggerUploadRUpdate({boolean:true,receipentAddress : window.btoa(this.state.receipentAddress.toLocaleLowerCase())},1)                                        
                                    }
                                }
                            }
                            else {
                                if(this.props.isFolder) {
                                    this.props.triggerUploadRUpdate({boolean:false,receipentAddress : ''},3)                                    
                                }
                                else {
                                    this.props.triggerUploadRUpdate({boolean:false,receipentAddress : ''},1)                                                                       
                                }
                            }
                        }}>Save</Button>                        
                    </center>
                </div>
                {/* Add Option Body */}
                <div className={this.props.currentDAttritubes.name !== 'explorer' && !this.props.fileUploaded.status ? 'showItNow' : 'dontShow'}>
                    <div className="add_option_header">
                        <Icon name='add'
                            style={{backgroundColor:'transparent',cursor:'pointer',float:'left',fontSize:'20px',border:'0px'}}
                            onClick={()=>this.setState({saveOptionClicked:false,addOptionClicked:false})} />
                        <div>Add to Folder</div>
                    </div>
                    {/* <Input style={showInput} labelPosition='right' type='text' value={this.props.currentDAttritubes.name} disabled>
                        <Label style={{backgroundColor:'#4875B4',color:'#fbfbfb'}} basic>Opened Folder : </Label>
                        <input />
                    </Input> */}
                    <Menu compact size="small" style={{border:'0px',boxShadow:'none'}}>
                        <Menu.Item style={{margin:'0px',fontSize:'12px'}}><Icon name='folder open' color="blue"/>Opened Folder : <b><i>{this.props.currentDAttritubes.name}</i></b></Menu.Item>
                    </Menu>
                    <div style={{fontSize:'12px',marginBottom:'2%'}}>
                        <input type="checkbox" checked={this.state.dontWannaShare}
                            onChange={() => this.setState({dontWannaShare:!this.state.dontWannaShare})}/>
                            <span style={{marginLeft:"1%"}}>i don't want to add any collaborator</span>
                    </div>
                    <Input style={this.state.dontWannaShare ? hide : showInput } 
                            labelPosition='right' placeholder='Enter collaborator Address'  type='text' 
                            onChange={(e)=>{
                                this.setState({receipentAddress:e.target.value})}
                            }
                            value={this.state.receipentAddress}
                            onFocus={()=>this.setState({enableNotAllowedLabel : 'disable'})}>
                        <Label style={{backgroundColor:'#4875B4',color:'#fbfbfb'}} basic>Add Collaborator : </Label>
                        <input />
                        <Label size="tiny" color="red" style={this.state.enableNotAllowedLabel === 'enable' ? show : hide } pointing="left">Please enter a value</Label>
                    </Input>
                    <center>
                        <Button size="tiny" color="facebook" 
                        disabled = {this.props.makeItLesserBright}
                        onClick={()=> {
                            if(!this.state.dontWannaShare) {
                                if(this.state.receipentAddress === '') {
                                    this.setState({enableNotAllowedLabel:'enable'})
                                }
                                else {
                                    if(this.props.isFolder) {
                                        this.props.triggerUploadRUpdate({boolean:true,receipentAddress : window.btoa(this.state.receipentAddress.toLocaleLowerCase())},4)
                                    }
                                    else {
                                        this.props.triggerUploadRUpdate({boolean:true,receipentAddress : window.btoa(this.state.receipentAddress.toLocaleLowerCase())},2)
                                    }
                                }
                            }
                            else {
                                if(this.props.isFolder) {
                                    this.props.triggerUploadRUpdate({boolean:false,receipentAddress : ''},4)                                    
                                }
                                else {
                                    this.props.triggerUploadRUpdate({boolean:false,receipentAddress : ''},2)                                
                                }
                            }
                        }}>Add</Button>                        
                    </center>
                </div>
                {/* File Uploaded Acknowledgement Block*/}
                <div className={this.props.fileUploaded.status ? 'showItNowWithMargin' : 'dontShow'}>                
                        <Header size="medium" color={this.props.fileUploaded.color}>{this.props.fileUploaded.message}</Header>
                        <Button basic color='green' size="tiny" content='Ok' 
                            onClick={()=> {
                                if(this.props.currentDAttritubes.name === 'explorer') {
                                    this.props.triggerRefresh() 
                                }
                                else {
                                    this.props.triggerRefreshOfFolder();
                                }
                            }}
                            />                     
                </div>
            </React.Fragment>
        )
    }
}
// {this.state.uploadnShareAction === "on" ?
// <div className="progress_bar">
//     <div className="inside_progress_bar"></div>
// </div> : 
// ''
// }
