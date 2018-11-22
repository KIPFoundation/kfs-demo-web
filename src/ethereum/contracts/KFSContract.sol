pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;
 
contract KFSContract{
    
    struct File{
        bytes32 fileName;
        string kfsHash;
    }
    File[] public allFiles;
    
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
    App[] public allApps;
   
    address owner;
    mapping(bytes32 => bool) files;
    mapping(bytes32 => bool) apps;
    mapping(address => File[]) fileOwner_file; // Maybe we can take this inside struct itself
    mapping(address => App[]) appOwner_app; // Maybe we can take this inside struct itself
    mapping(bytes32 => address[]) appName_receipents;
    mapping(bytes32 => uint) appName_index;
    mapping(bytes32 => mapping(address => bool)) appName_receipents_check;
    mapping(bytes32 => Update[]) appName_Updater; // Maybe we can take this inside struct itself
    
    event AppUpdated(bytes32 appName, string appID, address updater, uint updationDate, string latestHash);
    event Read(bytes32 name, address reader, uint timeofRead);
    
    modifier onlyOwner{
        require(msg.sender == owner);
        _;
    }
    
    function KFSContract(){
        owner = msg.sender;
    }
 
    function createFile(bytes32 _fileName, string _fileHash) public returns (bool saveFileBool){
        require(files[_fileName] == false);
        File memory file = File({fileName: _fileName, kfsHash: _fileHash});
        fileOwner_file[msg.sender].push(file);
        files[_fileName] = true;
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
 
    // Who is allowed to save receipents for a file? onlyOwner?
    function saveRecepientsForApp(bytes32 appName, address[] receipents) public returns (bool saveReceipentsBool){
        require(apps[appName] == true);
        for(uint i=0; i<receipents.length; i++){
            saveRecepientForApp(appName, receipents[i]);
        }
        return true;
    }
 
    function saveRecepientForApp(bytes32 appName, address receipent) private returns (bool){
        require(appName_receipents_check[appName][msg.sender] == true);
        appName_receipents[appName].push(receipent);
        appName_receipents_check[appName][receipent] = true;
        return true;
    }
 
    function getAppReceipents(bytes32 appName) public constant returns (address[] retReceipents){
        return appName_receipents[appName];
    }
    
    function checkAppReceipent(bytes32 fileName, address receipent) public constant returns (bool){
        return appName_receipents_check[fileName][receipent];
    }
    
    function createApp(bytes32 appName, string appID) public returns (bool createAppBool){
        require(apps[appName] == false);
        App memory app;
        app.appName = appName;
        app.appID = appID;
        apps[appName] = true;
        saveRecepientForApp(appName, msg.sender);
        appName_receipents_check[appName][msg.sender] = true;
        appOwner_app[msg.sender].push(app);
        appName_index[appName] = getAppCount();
        allApps.push(app);
        return true;
    }
    
    function updateApp(bytes32 appName, string appID, string fileHash) public returns (bool){
        require(appName_receipents_check[appName][msg.sender] == true);
        Update memory update = Update({updater: msg.sender, timeOfUpdate: now, hash: fileHash});
        App storage app = allApps[appName_index[appName]];
        app.kfshashes.push(fileHash);
        appName_Updater[appName].push(update);
        emit AppUpdated(appName, appID, msg.sender, now, fileHash);
        return true;
    }
    
    function getAllApps() public constant returns(bytes32[] retAppNames, string[] retAppIDs){
        bytes32[] localAppNames;
        string[] localAppIDs;
        for(uint i=0; i < allApps.length; i++){
            localAppNames.push(allApps[i].appName);
            localAppIDs.push(allApps[i].appID);
        }
        return (localAppNames, localAppIDs);   
    }
    
    function getUpdaterDetails(bytes32 appName) public constant returns(Update[] retUpdaters){
        return appName_Updater[appName];
    }
    
    function getAppsOfOwner() public constant returns (App[] retApps){
        return appOwner_app[msg.sender];
    }
    
}