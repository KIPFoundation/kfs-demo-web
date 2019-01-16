pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;
 
contract KFSContract{
    
    struct File{
        bytes32 fileName;
        string kfsHash;
    }
    File[] public allFiles; // To optimize gas, only fileName can be pushed and a mapping(bytes32 => File) could be created down the line
    
    struct Update{
        address updater;
        uint timeOfUpdate;
        string hash;
    }
    
    struct App{
        bytes32 appName;
        string appID;
        string[] kfshashes;
    }
    App[] public allApps; // To optimize gas, only appName can be pushed and a mapping(bytes32 => File) could be created down the line
   
    address owner;
    mapping(bytes32 => bool) fileName_check;
    mapping(bytes32 => bool) appName_check;
    mapping(address => File[]) fileOwner_file;
    mapping(address => App[]) appOwner_app;
    // mapping(bytes32 => address[]) appName_recipients;
    mapping(bytes32 => uint) appName_index;
    mapping(bytes32 => mapping(address => bool)) appName_recipients_check;
    mapping(bytes32 => Update[]) appName_Updater; // Maybe we can take this inside struct itself
    
    event AppUpdated(bytes32 appName, address updater, uint updationDate, string latestHash);
    event Read(bytes32 name, address reader, uint timeofRead);
    
    modifier onlyOwner{
        require(msg.sender == owner);
        _;
    }
    
    function KFSContract(){
        owner = msg.sender;
    }
 
    function createFile(bytes32 _fileName, string _fileHash, address recipient) public returns (bool saveFileBool){
        require(fileName_check[_fileName] == false);
        File memory file = File({fileName: _fileName, kfsHash: _fileHash});
        fileOwner_file[msg.sender].push(file);
        fileOwner_file[recipient].push(file);
        fileName_check[_fileName] = true;
        allFiles.push(file); // This can be removed, considering gas optimization, and only fileName can be pushed
        return true;
    }
    
    function getAdminFileStruct(uint fileIndex) onlyOwner constant returns (File retFile){
        return allFiles[fileIndex];
    }
    
    function getAllFiles() onlyOwner constant returns (File[] retAllFiles){
        return allFiles;
    }
 
    function getFileOfIndex(uint fileIndex) public constant returns (bytes32 retFileName, string retFileHash){
        return (fileOwner_file[msg.sender][fileIndex].fileName, fileOwner_file[msg.sender][fileIndex].kfsHash);
    }
    
    function getFileStructOfIndex(uint fileIndex) public constant returns (File retFile){
        return fileOwner_file[msg.sender][fileIndex];
    }
    
    function getFilesCount() public constant returns (uint retFilesCount){
        return fileOwner_file[msg.sender].length;
    }
    
    function getFilesOfOwner() public constant returns (File[] retFiles){
        return fileOwner_file[msg.sender];
    }
    
    function getAppCount() public constant returns (uint retAppCount){
        return allApps.length;
    }
    
    function readFile(bytes32 name, string hash) public returns (bool readFileBool){
        Read(name, msg.sender, now);
        return true;
    }
 
    // Who is allowed to save recipients for a file? onlyOwner?
    function saveRecepientsForApp(bytes32 appName, address[] recipients) public returns (bool saverecipientsBool){
        for(uint i=0; i<recipients.length; i++){
            saveRecipientForApp(appName, recipients[i]);
        }
        return true;
    }
 
    function saveRecipientForApp(bytes32 appName, address recipient) private returns (bool){
        require(appName_check[appName] == true && appName_recipients_check[appName][msg.sender] == true);
        // appName_recipients[appName].push(recipient);
        appName_recipients_check[appName][recipient] = true;
        return true;
    }
 
    // function getAppRecipients(bytes32 appName) public constant returns (address[] retrecipients){
    //     return appName_recipients[appName];
    // }
    
    function checkAppRecipient(bytes32 fileName, address recipient) public constant returns (bool){
        return appName_recipients_check[fileName][recipient];
    }
    
    function createApp(bytes32 appName, string appID) public returns (bool createAppBool){
        require(appName_check[appName] == false);
        App memory app;
        app.appName = appName;
        app.appID = appID;
        appName_check[appName] = true;
        appName_recipients_check[appName][msg.sender] = true;
        saveRecipientForApp(appName, msg.sender);
        appOwner_app[msg.sender].push(app);
        appName_index[appName] = getAppCount();
        allApps.push(app);
        return true;
    }
    
    function updateApp(bytes32 appName, string fileHash, address recipient) public returns (bool){
        require(appName_recipients_check[appName][msg.sender] == true);
        Update memory update = Update({updater: msg.sender, timeOfUpdate: now, hash: fileHash});
        App storage app = allApps[appName_index[appName]];
        app.kfshashes.push(fileHash);
        appOwner_app[recipient].push(app);
        appName_recipients_check[appName][recipient] = true;
        appName_Updater[appName].push(update);
        emit AppUpdated(appName, msg.sender, now, fileHash);
        return true;
    }
    
    function getAppWithAppName(bytes32 appName) public constant returns (App retApp){
        App storage app = allApps[appName_index[appName]];
        return app;
    }
    
    function checkAppPreviousHashes(bytes32 appName) public constant returns (string[] retHashStrings){
        App storage app = allApps[appName_index[appName]];
        return app.kfshashes;
    }
    
    function getUpdaterDetails(bytes32 appName) public constant returns(Update[] retUpdaters){
        return appName_Updater[appName];
    }
    
    function getAppsOfOwner() public constant returns (App[] retApps){
        return appOwner_app[msg.sender];
    }
    
    function getAppOfIndex(uint index) public constant returns (bytes32 retAppName, string retAppID){
        return (allApps[index].appName, allApps[index].appID);
    }
    
}
