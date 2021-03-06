import React from 'react';
import axios from 'axios';
import KIP_LOGO from '../assets/logo_without-title.png';
import {Image} from 'semantic-ui-react';
class CustomIFrame extends React.Component {
    state = {
        url:'',
        fetchingContent:true,
        isMediaFile:false,
        errorInFetching:false
    }
    componentDidMount() {
        const url = 'http://35.200.183.53:3000/read/'+this.props.kfsFileID+'?reciPub='+this.props.user;
        console.log(url);
        axios({
            method:'get',
            url: url,
            responseType:'blob',
            auth: {
                username : 'qwerty',
                password: '123456'
            }
        })
        .then( response => {
            // const fileName = this.props.fileName;
            // const indexOfExtension = fileName.lastIndexOf('.');
            // const extension = fileName.substr(indexOfExtension+1,fileName.length);
            // const mediaTypes = ['jpeg','png','gif','jpg','mp4','quicktime','x-flv','x-msvideo','x-matroska'];
            // const mediaBoolean = mediaTypes.find(type => type === extension)
            // if(mediaBoolean !== undefined) {
            //     this.setState({
            //         url : window.URL.createObjectURL(new Blob([response.data])),
            //         fetchingContent:false,
            //         isMediaFile:true
            //     });
            // }
            // else {
            //     this.setState({
            //         url : window.URL.createObjectURL(new Blob([response.data])),
            //         fetchingContent:false,
            //         isMediaFile:false
            //     });
            // }
            this.setState({
                url : window.URL.createObjectURL(new Blob([response.data])),
                fetchingContent:false,
            });
        })
        .catch(error => {
            this.setState({fetchingContent:false , errorInFetching : true});
            console.log(error);
        });   
    }
    render() {
        const iframe_container_with_bg = {
            position: 'relative',
            overflow: 'hidden',
            paddingTop: '56.25%',
            backgroundColor:'#fbfbfb'
        }        
        const iframe_content = {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            border: '0'
        }        
        return (
            <React.Fragment>
            {
                this.state.fetchingContent ? 
                <LoadingComponent />
                :
                      
                <div style={iframe_container_with_bg}>
                    <center>
                        {!this.state.errorInFetching ? 
                            <iframe 
                                title={this.props.fileName}
                                style={iframe_content} 
                                src={this.state.url} 
                                gesture="media"  allow="encrypted-media" allowFullScreen={true}>
                            </iframe> 
                            :
                            <h3 style={{color:'red'}}>Error while fetching the file</h3>
                        }
                    </center>
                </div>
            }
            </React.Fragment>
        );
    }
}
export default CustomIFrame; 

class LoadingComponent extends React.Component {
    render() {
      return (
        <div className="heart-beat-animation">
            <center>
              <Image height="40%" width="40%" style={{marginTop : '100px'}} src={ KIP_LOGO } />
            </center>
        </div>
      );
    }
  }