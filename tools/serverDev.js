/* eslint-disable import/default */
/* eslint-disable no-console */
import open from 'open';
import webpack from 'webpack';
import config  from '../webpack.config.js';
import WebpackDevServer from 'webpack-dev-server';
import progress from './progress';
import {PORT, LOCALHOST_PATH, ENTRY_POINT} from './constants';

const compiler = webpack(config);

progress(compiler);

const server = new WebpackDevServer(compiler, {
  hot: true,
  historyApiFallback: true,
  filename: config.output.filename,
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  },
  watchOptions: {aggregateTimeout: 300, poll: 1000}
});
server.listen(PORT, LOCALHOST_PATH, function (err) {
  if (err) {
    console.log(err);
  } else {
    open(ENTRY_POINT);
  }
});
