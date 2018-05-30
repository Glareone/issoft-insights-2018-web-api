import React, {Component} from 'react';
import routesConfiguration from '../../routing/routesConfiguration';
import './Media.less';

const {media} = routesConfiguration;

class Media extends Component {

  componentDidMount() {
    const videoElement = document.querySelector('#video');
    const logElement = document.querySelector('#log');
    const audioList = document.querySelector('#audioList');
    const videoList = document.querySelector('#videoList');
    const startButton = document.querySelector('#start');
    const enumerateButton = document.querySelector('#enumerate');
    const stopVideoButton = document.querySelector('#stopAudio');
    const canvas = document.getElementById('canvas');
    const takePicture = document.getElementById('takePicture');

    let videoTrack = null;
    let streaming = false;
    let width = 560;
    let height = 0;

    const constraints = {
      echoCancellation: true,
      video: {
        width: 480,
        height: 360,
        frameRate: 30
      },
      audio: false
    };

    enumerateButton.addEventListener('click', enumerateDevices);
    startButton.addEventListener('click', startStream);
    stopVideoButton.addEventListener('click', stopVideoStream);
    takePicture.addEventListener('click', function (ev) {
      takepicture();
      ev.preventDefault();
    }, false);

    function enumerateDevices() {
      navigator.mediaDevices.ondevicechange = handleDeviceChange;
      handleDeviceChange();
    }

    function handleDeviceChange(event) {
      navigator.mediaDevices.enumerateDevices().then(displayDevices);
    }

    function startStream() {
      videoElement.style.display = 'block';
      navigator.mediaDevices.getUserMedia(constraints)
        .then(applyStream)
        .catch(({name, message}) => log(`${name}: ${message}`));
    }

    function stopVideoStream() {
      if (videoTrack) {
        videoTrack.stop();
      }

      videoTrack = null;
      videoElement.srcObject = null;
      videoElement.style.display = 'none';
    }

    function applyStream(stream) {
      videoElement.srcObject = stream;
      getMediaTracks(stream);
    }

    function getMediaTracks(stream) {

      const videoTracks = stream.getVideoTracks();

      if (videoTracks.length) {
        videoTrack = videoTracks[0];
      }
    }

    function log(msg) {
      logElement.innerHTML += `<p>${msg}</p>`;
    }

    function displayDevices(devices) {
      audioList.innerHTML = '';
      videoList.innerHTML = '';

      devices.forEach(function (device) {
        const elem = document.createElement('li');
        const [kind, type, direction] = device.kind.match(/(\w+)(input|output)/i);

        elem.innerHTML = `<strong>${device.label}</strong> (${direction})`;
        if (type === 'audio') {
          audioList.appendChild(elem);
        } else if (type === 'video') {
          videoList.appendChild(elem);
        }
      });
    }

    function takepicture() {
      const context = canvas.getContext('2d');
      if (width && height) {
        canvas.style.display = 'block';
        canvas.width = width;
        canvas.height = height;
        context.drawImage(videoElement, 0, 0, width, height);
      }
    }

    videoElement.addEventListener('canplay', () => {
      if (!streaming) {
        height = videoElement.videoHeight / (videoElement.videoWidth / width);
        streaming = true;
      }
    }, false);
  }

  render() {
    return (
      <div className="pageWrapper mediaWrapper">
        <h3 className="pageIdentificator">{media.title}</h3>
        <h2>{media.title}</h2>
        <div className="controls">
          <button id="start">Start Stream</button>
          <button id="enumerate">Get Devices</button>
        </div>
        <div className="mediaWrapper">
          <div className="streamWrapper">
            <video id="video" width="480" height="360" autoPlay style={{display: 'none'}}/>
          </div>
          <canvas id="canvas" style={{display: 'none'}}/>
        </div>
        <div className="controls">
          <button id="stopAudio">Stop Video</button>
          <button id="takePicture">Take photo</button>
        </div>
        <div className="devicesInfo">
          <div className="deviceList">
            <p>AudioList</p>
            <ul id="audioList"/>
          </div>
          <div className="deviceList">
            <p>VideoList</p>
            <ul id="videoList"/>
          </div>
        </div>
        <div id="log"/>
        <ul id="tracks"/>
      </div>
    );
  }
}

export default Media;
