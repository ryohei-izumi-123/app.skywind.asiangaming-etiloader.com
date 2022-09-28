'use strict';
const uuidv5 = require('uuid/v5');
const uuidv1 = require('uuid/v1');
const NAMESPACE = uuidv1();
const APP_NAME = 'RED WOLF';
const result = uuidv5(APP_NAME, NAMESPACE);
console.log(result);
process.exit(0);

// '1b671a64-40d5-491e-99b0-da01ff1f3341';
