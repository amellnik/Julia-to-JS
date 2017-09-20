var o = require('./out/out.js');
var myabs = o.cwrap('julia_myabs_2474', 'number', ['number']);
console.log(myabs(-1.2));
// This doesn't work
// var myabs2 = o.cwrap('jlcapi_myabs_2474', 'number', ['number']);
// console.log(myabs2(-1.2));
