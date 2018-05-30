import React, {Component} from 'react';
import routesConfiguration from '../../routing/routesConfiguration';
import './NetworkInformation.less';

const {networkInfo} = routesConfiguration;

class NetworkInformation extends Component {

  componentDidMount() {
    const currentConnectionInfo = document.getElementById('currentConnectionInfo');
    const changedConnectionInfo = document.getElementById('changedConnectionInfo');
    const videoInfo = document.getElementById('videoInfo');
    const video = document.getElementById('video');

    const currentConnection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    let oldType;
    let oldEffectiveType;

    currentConnection.addEventListener('change', updateConnectionInfo);

    updateCurrentConnectionInfo();
    setupOldConnectionProperties();
    setupVideoProperties();

    function updateCurrentConnectionInfo() {
      currentConnectionInfo.innerHTML = `<p>Connection type: <strong>${getValue(currentConnection.type)}</strong></p>`;
      currentConnectionInfo.innerHTML += `<p>Connection effective type: <strong>${getValue(currentConnection.effectiveType)}</strong></p>`;
      currentConnectionInfo.innerHTML += `<p>Download speed:<strong> ${getValue(currentConnection.downlink)} Mbps</strong></p>`;
      currentConnectionInfo.innerHTML += `<p>Download max speed: <strong>${getValue(currentConnection.downlinkMax)} Mbps</strong></p>`;
    }

    function setupOldConnectionProperties() {
      oldType = currentConnection.type;
      oldEffectiveType = currentConnection.effectiveType;
    }

    function setupVideoProperties() {
      video.autoplay = currentConnection.type !== 'cellular';
      if (video.autoplay) {
        video.play();
      } else {
        video.pause();
      }
      videoInfo.innerHTML = `<p>Video autoplay is <strong>${video.autoplay ? 'ON' : 'OFF'}</strong> (Off only for 'cellular' connection type)</p>`;
    }

    function getValue(value) {
      return value || 'N/A';
    }

    function updateConnectionInfo() {
      updateCurrentConnectionInfo();
      if (currentConnection.effectiveType || currentConnection.type) {
        if (oldType !== currentConnection.type) {
          logTypeChanges();
        } else if (oldEffectiveType !== currentConnection.effectiveType) {
          logEffectiveTypeChanges();
        }
        setupOldConnectionProperties();
        setupVideoProperties();
      }
    }

    function logTypeChanges() {
      changedConnectionInfo.innerHTML += `<p>${new Date().toLocaleString()} Type changed from <strong>${getValue(oldType)}</strong> to <strong>${getValue(currentConnection.type)}</strong><p>`;
    }

    function logEffectiveTypeChanges() {
      changedConnectionInfo.innerHTML += `<p>${new Date().toLocaleString()} Effective type changed from <strong>${getValue(oldEffectiveType)}</strong> to <strong>${getValue(currentConnection.effectiveType)}</strong><p>`;
    }
  }

  render() {
    return (
      <div className="pageWrapper networkInfoWrapper">
        <h3
          className="pageIdentificator"
        >
          {networkInfo.title}
        </h3>
        <div id="currentConnectionInfo"/>
        <video id="video" muted loop width="1480" height="360">
          <source
            src="https://s3-ap-northeast-1.amazonaws.com/daniemon/demos/The%2BVillage-Mobile.mp4"
            type="video/mp4"
            media="all and (max-width:680px)"
          />
        </video>
        <div id="videoInfo"/>
        <div id="changedConnectionInfo"/>
      </div>
    );
  }
}

export default NetworkInformation;
