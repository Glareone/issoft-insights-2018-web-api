import React, {Component} from 'react';
import routesConfiguration from '../../routing/routesConfiguration';
import './PageVisibility.less';

const {pageVisibility} = routesConfiguration;

class PageVisibility extends Component {
  constructor(props) {
    super(props);

    this.videoElement = null;
    this.state = {
      visibilityState: [document.visibilityState]
    };

    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handlePauseVideo = this.handlePauseVideo.bind(this);
    this.handlePlayVideo = this.handlePlayVideo.bind(this);
  }

  componentDidMount() {
    this.subscribe();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handlePlayVideo() {
    document.title = 'Playing';
  }

  handlePauseVideo() {
    document.title = 'Paused';
  }

  handleVisibilityChange() {
    this.setState(({visibilityState}) => ({visibilityState: visibilityState.concat(document.visibilityState)}));
    if (!document.hidden) {
      this.videoElement.pause();
    } else {
      this.videoElement.play();
    }
  }

  subscribe() {
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    this.videoElement.addEventListener('pause', this.handlePauseVideo);
    this.videoElement.addEventListener('play', this.handlePlayVideo);
  }

  unsubscribe() {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    this.videoElement.removeEventListener('pause', this.handlePauseVideo);
    this.videoElement.removeEventListener('play', this.handlePlayVideo);
  }

  render() {
    const stateCount = this.state.visibilityState.length;
    return (
      <div className="pageWrapper pageVisibility">
        <h3
          className="pageIdentificator"
        >
          {pageVisibility.title}
        </h3>
        <h2>{pageVisibility.title}</h2>
        <div
          className="stateContainer"
        >
          {
            this.state.visibilityState.map((state, index) => {
              const textDecoration = stateCount > 2 && index < stateCount - 2 ? 'line-through' : 'none';
              return (
                <strong
                  key={index}
                  className={`state ${index >= stateCount - 2 && 'marked-state'}`}
                  style={{textDecoration}}
                >
                  {state}
                  {index === stateCount - 1 && <span style={{color: 'darkgreen', fontSize: '15px'}}>(last step)</span>}
                  {index === stateCount - 2 && <span style={{color: 'darkred', fontSize: '15px'}}>(previous step)</span>}
                </strong>
              );
            })}
        </div>
        <main>
          <video
            ref={video => this.videoElement = video}
            width="1480"
            height="360"
          >
            <source
              src="https://s3-ap-northeast-1.amazonaws.com/daniemon/demos/The%2BVillage-Mobile.mp4"
              type="video/mp4"
              media="all and (max-width:680px)"
            />
            <source
              src="https://s3-ap-northeast-1.amazonaws.com/daniemon/demos/The%2BVillage-Mobile.webm"
              type="video/webm"
              media="all and (max-width:680px)"
            />
            <source
              src="https://s3-ap-northeast-1.amazonaws.com/daniemon/demos/The%2BVillage-SD.mp4"
              type="video/mp4"
            />
            <source
              src="https://s3-ap-northeast-1.amazonaws.com/daniemon/demos/The%2BVillage-SD.webm"
              type="video/webm"
            />
            <p>Oops!</p>
          </video>
        </main>
      </div>
    );
  }
}

export default PageVisibility;
