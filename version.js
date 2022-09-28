'use strict';
const cliGreen = '\u001b[32m';
const cliRed = '\u001b[31m';
const cliDefault = '\u001b[0m';
const replace = require('replace-in-files');
const _ = require('lodash');
const version = require('./package.json').version;
const options = {
  optionsForFiles: {
    'ignore': [
      '**/node_modules/**'
    ]
  },
  allowEmptyPaths: false,
  saveOldFile: false,
  encoding: 'utf8',
  onlyFindPathsWithoutReplace: false,
  returnPaths: true,
  returnCountOfMatchesByPaths: true,
};
const opt1 = _.assign(_.cloneDeep(options), {
  files: [
    'config/default.json',
    'config/development.json',
    'config/staging.json',
    'config/production.json',
  ],
  from: new RegExp(/"version": "(.*)",/, 'gi'),
  to: `"version": "${version}",`,
});
const opt2 = _.assign(_.cloneDeep(options), {
  files: [
    'src/environments/environment.ts',
    'src/environments/environment.staging.ts',
    'src/environments/environment.prod.ts',
  ],
  from: new RegExp(/version: '(.*)',/, 'gi'),
  to: `version: '${version}',`,
});
const resolve = (results) => results.map(result => result ? console.log(`${cliGreen} Build version ${version}, Modified files ${JSON.stringify(result.countOfMatchesByPaths)} ${cliDefault}`, result) : undefined);
const reject = (errors) => errors.map(error => error ? console.error(`${cliRed} Error occurred, reason ${error.message} ${cliDefault}`, error) : undefined);

Promise.all([replace(opt1), replace(opt2)]).then(resolve).catch(reject).finally(() => process.exit(0));
