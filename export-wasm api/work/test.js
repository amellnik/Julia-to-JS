var em_module = require('./unlikely_named_fn.wasm.js');

console.log(em_module._unlikely_named_fn(2)); // direct calling works
// em_module.ccall("sayHi"); // using ccall etc. also work
// console.log(em_module._daysInWeek()); // values can be returned, etc.
