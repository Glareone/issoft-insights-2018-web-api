/* eslint-disable no-console */
import ProgressPlugin from 'webpack/lib/ProgressPlugin';

export default compiler => {
  compiler.apply(new ProgressPlugin(percentage => {
    if (process.stdout.isTTY) {
      process.stdout.cursorTo(0);
      process.stdout.write(`${(percentage * 100).toFixed(0)}%`);
      process.stdout.clearLine(1);
    }
  }));
};
