import React, {Component} from 'react';
import {object} from 'prop-types';
import routesConfiguration from '../../routing/routesConfiguration'

const {phraseMatcher, speechSynthesis, speechColorChanger} = routesConfiguration;

class ContentList extends Component {

  static propTypes = {
    history: object
  };

  redirect = path => {
    this.props.history.push(path);
  };

  render() {
    return (
      <div className="content">
        <h1
          className="sectionTitle"
          onClick={() => this.redirect(speechSynthesis.path)}
        >
          {speechSynthesis.title}
        </h1>
        <h1
          className="sectionTitle"
          onClick={() => this.redirect(phraseMatcher.path)}
        >
          {phraseMatcher.title}
        </h1>
        <h1
          className="sectionTitle"
          onClick={() => this.redirect(speechColorChanger.path)}
        >
          {speechColorChanger.title}
        </h1>
      </div>
    );
  }
}

export default ContentList;
