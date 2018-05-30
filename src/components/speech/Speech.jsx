import React, {Component} from 'react';
import {object} from 'prop-types';
import {Route, Switch} from 'react-router-dom';
import PhraseMatcher from './phrase-matcher/PhraseMatcher';
import SpeechSynthesis from './speech-synthesis/SpeechSynthesis';
import SpeechColorChanger from './speech-color-changer/SpeechColorChanger';
import routesConfiguration from '../../routing/routesConfiguration'
import ContentList from './ContentList';

const {phraseMatcher, speechSynthesis, speechMain, speechColorChanger} = routesConfiguration;

class Speech extends Component {

  static propTypes = {
    history: object
  };

  redirect = path => {
    this.props.history.push(path);
  };

  render() {
    return (
      <div className="pageWrapper">
        <h3
          onClick={() => this.redirect(speechMain.path)}
          className="pageIdentificator"
        >
          {speechMain.title}
        </h3>
        <Switch>
          <Route exact path={speechMain.path} component={ContentList}/>
          <Route exact path={phraseMatcher.path} component={PhraseMatcher}/>
          <Route exact path={speechSynthesis.path} component={SpeechSynthesis}/>
          <Route exact path={speechColorChanger.path} component={SpeechColorChanger}/>
        </Switch>
      </div>
    );
  }
}

export default Speech;
