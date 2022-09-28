let result

const fs = require('fs');
const browser = 'node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/browser.js';
fs.readFile(browser, 'utf8', (err, data) => {
  if (err) {
    return console.log(err);
  }
  result = data.replace(/target: "electron-renderer",/g, '')
  result = result.replace(/target: "web",/g, '')
  result = result.replace(/return \{/g, 'return {target: "electron-renderer",')

  fs.writeFile(browser, result, 'utf8', (err) => {
    if (err) {
      return console.log(err);
    }
  })
})
