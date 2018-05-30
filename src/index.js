import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import App from './components/App';
import {BrowserRouter, Route} from 'react-router-dom';
import routesConfiguration from './routing/routesConfiguration'
import './styles.less';

const {root} = routesConfiguration;

render(
  <BrowserRouter>
      <Route path={root.path} component={App}/>
  </BrowserRouter>,
  document.getElementById('application-root')
);
