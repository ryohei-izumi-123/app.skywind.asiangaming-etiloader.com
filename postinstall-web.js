// Allow angular using electron module (native node modules)
const fs = require('fs');
const browser = 'node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/browser.js';
let result

fs.readFile(browser, 'utf8', (err, data) => {
  if (err) {
    return console.log(err);
  }

  result = data.replace(/target: "electron-renderer",/g, '');
  result = result.replace(/target: "web",/g, '');
  result = result.replace(/return \{/g, 'return {target: "web",');

  fs.writeFile(browser, result, 'utf8', (err) => {
    if (err) {
      return console.log(err);
    }
  })
})
