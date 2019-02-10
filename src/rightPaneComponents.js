import React from 'react';
import "./StylingKfsComponents.css";
import {Button,Icon} from 'semantic-ui-react';
class RightPaneComponent extends React.Component {
    render() {
        return (
            <div style={{marginTop:'30%'}}>
                <div class="file-input-wrapper">
                    <Button className="btn-file-input" primary>
                        <Icon size="large" name='upload' />
                        <div style={{margin:'3% 0px 0px 0px'}}>Upload</div>
                    </Button>
                    <input type="file" name="file" />
                </div>
            </div>
        )
    }
}
export default RightPaneComponent;