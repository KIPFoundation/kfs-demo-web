pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;

contract KFSContract{
    
    struct File{
        bytes32 fileName;
        string kfsHash;
    }
    File[] allFiles;
    
    address owner;
    mapping(bytes32 => bool) files;
    mapping(address => File[]) fileOwner_file;
    
    modifier onlyOwner{
        require(msg.sender == owner);
        _;
    }
    
    function KFSContract(){
        owner = msg.sender;
    }
    
    function saveFile(bytes32 _fileName, string _fileHash) public returns (bool saveFileBool){
        require(files[_fileName] == false);
        File memory file = File({fileName: _fileName, kfsHash: _fileHash});
        fileOwner_file[msg.sender].push(file);
        files[_fileName] = true;
        allFiles.push(file);
        return true;
    }
    
    function getAllFiles(uint fileIndex) onlyOwner constant returns (File retFiles){
        return allFiles[fileIndex];
    }
    
    function getFile(uint fileIndex) public constant returns (bytes32 retFileName, string retFileHash){
        return (fileOwner_file[msg.sender][fileIndex].fileName, fileOwner_file[msg.sender][fileIndex].kfsHash);
    }
    
    function getFileStruct(uint fileIndex) public constant returns (File retFile){
        return fileOwner_file[msg.sender][fileIndex];
    }
    
    function getFilesLength() public constant returns (uint retFilesLength){
        return fileOwner_file[msg.sender].length;
    }
    
    function getFilesStruct() public constant returns (File[] retFiles){
        return fileOwner_file[msg.sender];
    }
    
}