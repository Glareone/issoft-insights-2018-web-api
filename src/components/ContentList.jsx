import React, {Component} from 'react';
import {object, number, func, bool} from 'prop-types';
import classNames from 'classnames';
import routesConfiguration from '../routing/routesConfiguration';
import './ContentList.less';

const {speechMain, pageVisibility, dragAndDrop, media, dialog, faceDetection, networkInfo} = routesConfiguration;

class ContentList extends Component {

  static propTypes = {
    onUnlockHardCoreFeature: func,
    isExperimentalFeatureLocked: bool,
    history: object,
    step: number
  };

  redirect = path => {
    this.props.history.push(path);
  };

  handleRenderHardCoreFeature = hardCoreFeatureMode => {
    return hardCoreFeatureMode
      ? <div className="experimental-feature">
        <h1 className="sectionTitle">Hardcore Feature</h1>
        <div>
          <button
            className="unlock-hardcore-button"
            onClick={this.props.onUnlockHardCoreFeature}
          >
            <h2>unlock</h2>
          </button>
        </div>
      </div>
      : (
        <h1
          onClick={() => this.redirect(faceDetection.path)}
          className={classNames([
            'sectionTitle',
            `sectionTitle-${faceDetection.step}`
          ])}
        >
          {faceDetection.title}
        </h1>
      );
  };

  render() {
    const {step, isExperimentalFeatureLocked} = this.props;
    return (
      <div className={classNames([
        'content',
        {'experimentalFeatureUnLocked': !isExperimentalFeatureLocked},
        {'experimentalFeatureAppeared': step > faceDetection.step}
      ])}
      >
        {
          step > dragAndDrop.step &&
          <h1
            className={classNames(['sectionTitle', `sectionTitle-${dragAndDrop.step}`])}
            onClick={() => this.redirect(dragAndDrop.path)}
          >
            {dragAndDrop.title}
          </h1>
        }
        {
          step > speechMain.step &&
          <h1
            className={classNames(['sectionTitle', `sectionTitle-${speechMain.step}`])}
            onClick={() => this.redirect(speechMain.path)}
          >
            {speechMain.title}
          </h1>
        }
        {
          step > dialog.step &&
          <h1
            className={classNames(['sectionTitle', `sectionTitle-${dialog.step}`])}
            onClick={() => this.redirect(dialog.path)}
          >
            {dialog.title}
          </h1>
        }
        {
          step > pageVisibility.step &&
          <h1
            className={classNames(['sectionTitle', `sectionTitle-${pageVisibility.step}`])}
            onClick={() => this.redirect(pageVisibility.path)}
          >
            {pageVisibility.title}
          </h1>
        }
        {
          step > media.step &&
          <h1
            className={classNames(['sectionTitle', `sectionTitle-${media.step}`])}
            onClick={() => this.redirect(media.path)}
          >
            {media.title}
          </h1>
        }
        {
          step > networkInfo.step &&
          <h1
            className={classNames([
              'sectionTitle',
              `sectionTitle-${networkInfo.step}`
            ])}
            onClick={() => this.redirect(networkInfo.path)}
          >
            {networkInfo.title}
          </h1>
        }
        {
          step > faceDetection.step && this.handleRenderHardCoreFeature(isExperimentalFeatureLocked)
        }
      </div>
    );
  }
}

export default ContentList;
