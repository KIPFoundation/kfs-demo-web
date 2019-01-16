import React from 'react';
// import ExplorerView from './explorerView';
import { Icon } from 'semantic-ui-react';

const TransactBlock_Repo_Structure= [
    {
      type:"folder",
      name: "Source",
      children: [
        {
          type: "folder",
          name: "Views",
          children: [
            {
              type: "folder",
              name: "General Partner",
              children: [
                {
                  type: "file",
                  name: "Creating Fund",
                }, 
                {
                  type: "file",
                  name: "Activity Report",
                },
                {
                    type: "file",
                    name: "Capital Statement",
                }
              ]
            },
            {
                type: "folder",
                name: "Limited Partner",
                children: [
                  {
                    type: "file",
                    name: "Announcements",
                  }, 
                  {
                    type: "file",
                    name: "Committing Fund",
                  },
                  {
                      type: "file",
                      name: " My Accounts",
                  }
                ]
            }
          ],      
        },
        {
            type: "folder",
            name: "Ethereum",
            children: [
              {
                type: "folder",
                name: "Contracts",
                children: [
                  {
                    type: "file",
                    name: "KFSContract.sol",
                  }
                ]
              },
              {
                  type: "folder",
                  name: "Build",
                  children: [
                    {
                      type: "file",
                      name: "KFSContract.json",
                    },
                  ]
              }
            ],      
          },
          {
            type:"file",
            name:"Index.js"
            },
            {
                type:"file",
                name:"routes.js"
            },
            {
                type:"file",
                name:"index.css"
            }
      ]
    },
    {
        type:"file",
        name:"package.json"
    },
    {
        type:"file",
        name:"README.md"
    }
  ];


class Drive extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            folders:[],
            files:[],
            pathTracker:[],
            pathTrackerContent:[],
            trackedPath:''
        }
    }

    componentDidMount() {
        this.renderInnerContent(TransactBlock_Repo_Structure,1);
    }

    renderInnerContent = (innerContent) => {
        let tempFolders = [];
        let tempFiles = [];
        let folderCount = 0;
        let filesCount = 0;
        let tempPathTrackerContent = this.state.pathTrackerContent;
        let tempPathTracker = this.state.pathTracker;

        for(let content of innerContent) {
          if(content.type == "folder") {
            tempFolders[folderCount++] = ( <div onClick={() => {     
                    tempPathTrackerContent.push(content.children);
                    tempPathTracker.push(content.name);
                    this.renderInnerContent(content.children)
                }
             }  className="card">
                                <Icon name='folder' />
                                <span>{content.name}</span>
                            </div>);
          }
          else {
            tempFiles[filesCount++] = ( <div className="card">
                                            <Icon name='file' />
                                            <span>{content.name}</span>
                                        </div>);
          }
        }
        this.setState({ folders : tempFolders , files : tempFiles , pathTracker:tempPathTracker , pathTrackerContent : tempPathTrackerContent});
    }
    
    renderPathSelection = (route) => {
        let tempPathTracker = this.state.pathTracker;
        const pathLength = tempPathTracker.length;
        if(route == -1) { 
            let emptyArray = tempPathTracker.splice(pathLength*-1,pathLength);  
            this.setState({ pathTracked : emptyArray, pathTrackerContent : emptyArray });
            this.renderInnerContent(TransactBlock_Repo_Structure);
        }
        else {
            const level = tempPathTracker.indexOf(route);
            let tempPathTrackerContent = this.state.pathTrackerContent;
            let splicing = pathLength - (level + 1);
            tempPathTracker.splice(splicing*-1,splicing);
            tempPathTrackerContent.splice(splicing*-1,splicing);
            this.setState({ pathTracked : tempPathTracker , pathTrackerContent : tempPathTrackerContent });
            this.renderInnerContent(this.state.pathTrackerContent[level]);
        }
    }

    render() {
        const pathTracked = this.state.pathTracker;
        let pathRoutes = [];
        let i=1;
        pathRoutes[0] = (
            <div style={{display:'flex'}} className="pathBlock">
                <div onClick={() => this.renderPathSelection(-1)}>My KFS Drive</div>
                <span style={{marginLeft:'6px'}}>&gt;</span>
            </div>
        );
        for(let route of pathTracked) {
            pathRoutes[i] = (
                <div style={{display:'flex'}} className="pathBlock">
                    <div onClick={() => this.renderPathSelection(route)}>{route}</div>
                    <span style={{marginLeft:'10px'}}>&gt;</span>
                </div>
            );
            i++;
        }

        return (
            <div style={{backgroundColor:'white',padding:'5% 10% 10% 15%'}}>
                <div style={{fontSize:'24px',marginLeft:'30px',display:'flex'}}>{pathRoutes}</div>
                <hr />
                {this.state.folders.length!=0 ?
                    <div>
                        <h3 style={{marginLeft:'35px'}}>Folders</h3>
                        <div className="grid_css">
                            {this.state.folders}
                        </div>
                    </div> : ''
                }
                {this.state.files.length!=0 ?
                    <div>
                        <h3 style={{marginLeft:'35px'}}>Files</h3>
                        <div className="grid_css">
                            {this.state.files}
                        </div>
                    </div> : ''
                }
            </div>
        );
    }
}

export default Drive;