'use strict';
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const valids = ['development', 'staging', 'production'];
const env =
  process.env.NODE_ENV ||
  process.argv.slice(2).find(arg => valids.includes(arg)) ||
  'production';
const filenames = ['.env', 'electron-builder.env'];
const options = {
  encoding: 'utf-8'
};
for (let filename of filenames) {
  const filepath = path.join(__dirname, filename);
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
  }

  fs.writeFileSync(filepath, `NODE_ENV=${env}\n`, options);
  console.info(`[NODE_ENV]: ${env} [FILE]: ${filepath} CREATED.`);
}

process.exit();
