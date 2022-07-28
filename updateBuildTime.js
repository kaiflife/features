/* eslint-disable */
const fs = require('fs');

const sw_file = './src/forceUpdateCache.js';

const buildDate = `console.log(${new Date().getTime()})`;

fs.writeFile(sw_file, buildDate, 'utf8', (error) => {
  if (error) {
    return console.warn(error);
  }
  return console.warn('All right');
});


// in your package.json scripts
// "build": "node ./updateBuildTime.js && react-scripts build && cat src/forceUpdateCache.js >> build/service-worker.js",
