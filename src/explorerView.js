import React from 'react';
import { Icon } from 'semantic-ui-react';

class ExplorerView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentFolderView : props.folder,
            currentFolder:''
        }
    }

    componentDidMount() {
        this.renderFolder(this.state.currentFolderView);
    }
    
    renderFolder = (view) => {
        const folderView =  ( 
            <div>
                <h3 style={{marginLeft:'35px'}}>Folders {view}</h3>
                <hr />
                <div className="grid_css">
                    <div onClick={() => this.renderFolder(view*2)} className="card">
                        <Icon name='folder' />
                        <span>KFS Folder {view*2}</span>
                    </div>
                    <div onClick={() => this.renderFolder(view*3)} className="card">
                        <Icon name='folder' />
                        <span>KFS Folder {view*3}</span>
                    </div>
                </div>

                <h3 style={{marginLeft:'35px'}}>Files</h3>
                <hr />
                <div className="grid_css">
                    <div className="card">
                        <Icon name='file' />
                        <span>KFS File</span>
                    </div>
                </div>
            </div>
        );
        this.setState({currentFolder : folderView});
    }

    

    render() {
        return (
            <div>
                {this.state.currentFolder}
            </div>
        );
    }
}

export default ExplorerView;