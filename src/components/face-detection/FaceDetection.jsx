import React from 'react';
import routesConfiguration from '../../routing/routesConfiguration';
import './FaceDetection.less';

const {faceDetection} = routesConfiguration;

class FaceDetection extends React.Component {
  constructor(props) {
    super(props);

    this.videoTrack = null;
    this.state = {
      showLandmarks: false,
      faceAppeared: null,
      videoPlaying: false
    };
  }

  _videoRef = video => {
    this.video = video;
  };

  _faceBox = faceBox => {
    this.faceBox = faceBox;
  };

  _mediaContainer = container => {
    this.mediaContainer = container;
  };

  _trash = trash => {
    this.trash = trash;
  };

  componentWillUnmount() {
    clearInterval(this.inverval);
  }

  componentDidMount() {
    if (typeof window.FaceDetector === 'undefined') {
      alert('No face detection!');
      return;
    }
    document.querySelectorAll('.dropTarget').forEach(this.addListenersForDropping);
    this.faceDetector = new window.FaceDetector();
    this.addListenersForDropping(this.trash);
  }

  addListenersForDragging = element => {
    element.addEventListener('dragstart', this.handleDragStart);
    element.addEventListener('drag', this.handleDrag);
    element.addEventListener('dragend', this.handleDragEnd);
  };

  addListenersForDropping = element => {
    element.addEventListener('drop', this.handleDrop);
    element.addEventListener('dragover', this.handleDragOver);
    element.addEventListener('dragleave', this.handleDragLeave);
  };

  handleDragStart = event => {
    event.dataTransfer.setData('text/plain', event.target.id);
    event.target.classList.add('isDragStarted');
  };

  handleDrag = event => {
    event.target.classList.add('isDragged');
  };

  handleDragEnd = event => {
    event.target.classList.remove('isDragged');
    event.target.classList.remove('isDragStarted');
  };

  handleDragOver = event => {
    event.preventDefault(); // preventing touch and pointer events
    event.target.classList.add('isOver');
    event.dataTransfer.dropEffect = 'move';
  };

  handleDragLeave = event => {
    event.target.classList.remove('isOver');
  };

  handleDrop = event => {
    event.preventDefault();
    const dataItems = event.dataTransfer.items; //DataTransferItemList object
    for (let i = 0; i < dataItems.length; i += 1) {
      if (dataItems[i].kind === 'string' && dataItems[i].type.match('^text/plain')) {
        dataItems[i].getAsString((s) => {
          console.log('... Drop: Text');
          const draggableItem = document.getElementById(s);
          if (event.target === this.trash) {
            draggableItem.parentElement.removeChild(draggableItem);
            this.setState({showLandmarks: false, faceAppeared: null});
            document.querySelectorAll('.detected-face-box').forEach(el => el.parentElement.removeChild(el));
          } else {
            document.getElementById(s) && event.target.appendChild(document.getElementById(s));
          }
        });
      } else if (dataItems[i].kind === 'string' && dataItems[i].type.match('^text/html')) {
        console.log('... Drop: HTML');
      } else if (dataItems[i].kind === 'string' && dataItems[i].type.match('^text/uri-list')) {
        console.log('... Drop: URI');
      } else if (dataItems[i].kind === 'file' && dataItems[i].type.match('^image/')) {
        const f = dataItems[i].getAsFile();
        const reader = new FileReader();
        reader.onload = ({target: {result}}) => {
          const image = document.createElement('img');
          image.src = result;
          image.draggable = true;
          image.id = `fileImg-${Date.now()}`;
          this.addListenersForDragging(image);
          event.target.appendChild(image);
          this.setState({faceAppeared: image});
        };

        reader.readAsDataURL(f);
        console.log('... Drop: File ');
      }
    }
    event.target.classList.remove('isOver');
  };

  startVideo = () => {
    const constrains = {audio: false, video: {width: 1440, height: 720}};
    this.setState({videoPlaying: true});
    navigator.mediaDevices.getUserMedia(constrains).then(this.applyStream);
  };

  applyStream = stream => {
    const videoTracks = stream.getVideoTracks();

    if (videoTracks.length) {
      this.videoTrack = videoTracks[0];
    }
    this.video.srcObject = stream;
    setTimeout(() => {
      this.inverval = setInterval(() => {
        this.detectFaces(this.video);
      }, 150);
    }, 500);
  };

  detectFaces = target => {
    this.faceDetector.detect(target)
      .then(this.handleDetectFaces)
      .catch(err => {
        console.log('Handled Error', err);
        this.stopVideo();
      });
  };

  detectFacesOnImage = target => {
    this.faceDetector.detect(target)
      .then(this.handleDetectFacesOnImage)
      .catch(err => {
        console.log('Handled Error', err);
        this.stopVideo();
      });
  };

  handleDetectFacesOnImage = faces => {
    faces.forEach(face => {
      const {width, height, top, left} = face.boundingBox;

      const faceBox = document.createElement('div');
      this.mediaContainer.appendChild(faceBox);
      faceBox.classList.add('detected-face-box');
      faceBox.style.cssText = `
                position: absolute;
                z-index: 2;
                width: ${width}px;
                height: ${height}px;
                top: ${top}px;
                left: ${left}px;
              `;

      face.landmarks.forEach((landmark, index) => {
        if (landmark.type !== 'eye') {
          return;
        }

        const [{x, y}] = landmark.locations;
        const eye = document.createElement('div');
        faceBox.appendChild(eye);
        eye.style.cssText = `z-index: 2;
             width: 35%;
             height: 35%;
             position: absolute;
             background-size: cover;
             top: calc(${y - top}px - 17%);
             left: calc(${x - left}px - 17%);
             background-image: url('https://orig00.deviantart.net/39bb/f/2016/217/1/0/free_googly_eye_by_terrakatski-dacmqt2.png');
            `;
      });
    });
    !this.state.showLandmarks && this.setState({showLandmarks: true});
  };

  handleDetectFaces = faces => {
    faces.forEach(face => {
      const {width, height, top, left} = face.boundingBox;

      this.faceBox.style.cssText = `
                position: absolute;
                z-index: 2;
                width: ${width}px;
                height: ${height}px;
                top: ${top}px;
                left: ${left}px;
              `;

      face.landmarks.forEach((landmark, index) => {
        if (landmark.type !== 'eye') {
          return;
        }

        const [{x, y}] = landmark.locations;
        const div = document.getElementById(`eye-${index}`);
        div.style.cssText = `z-index: 2;
             width: 35%;
             height: 35%;
             position: absolute;
             background-size: cover;
             top: calc(${y - top}px - 17%);
             left: calc(${x - left}px - 17%);
             background-image: url('https://orig00.deviantart.net/39bb/f/2016/217/1/0/free_googly_eye_by_terrakatski-dacmqt2.png');
            `;
      });
    });
    !this.state.showLandmarks && this.setState({showLandmarks: true});
  };

  stopVideo = () => {
    if (this.videoTrack) {
      this.videoTrack.stop();
    }
    this.videoTrack = null;
    this.video.srcObject = null;
    clearInterval(this.inverval);
    this.setState({showLandmarks: false, videoPlaying: false});
  };

  render() {
    return (
      <div
        id="wrapper"
        className="pageWrapper faceDetection"
      >
        <h3
          className="pageIdentificator"
        >
          {faceDetection.title}
        </h3>
        <h2>{faceDetection.title}</h2>
        <div className="controls">
          {this.state.videoPlaying
            ? <button onClick={this.stopVideo}>Stop Video</button>
            : <button onClick={this.startVideo}>Start Video</button>
          }
          {
            this.state.faceAppeared &&
            <div className="detectFace">
              <button onClick={() => this.detectFacesOnImage(this.state.faceAppeared)}>DETECT FACE</button>
            </div>
          }
        </div>
        <div ref={this._mediaContainer} className="media-container dropTarget">
          <video
            style={{display: this.state.videoPlaying ? 'block' : 'none'}}
            ref={this._videoRef}
            autoPlay
          />
          {(this.state.videoPlaying || this.state.faceAppeared) &&
          <div ref={this._faceBox} style={{display: this.state.showLandmarks ? 'block' : 'none'}}>
            <div id="eye-0"/>
            <div id="eye-1"/>
          </div>
          }
        </div>
        <div ref={this._trash} className="trash" style={{visibility: this.state.videoPlaying ? 'hidden' : 'visible'}}/>
      </div>
    );
  }
}

export default FaceDetection;
