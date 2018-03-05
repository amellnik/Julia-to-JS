var express = require('express');
var bodyParser = require('body-parser')
var tmp = require('tmp');
var fs = require("fs");
var exec = require('child_process').exec;


var app = express();
var child;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  var allowedOrigins = ['http://localhost:4200', 'https://alex.mellnik.net'];
  var origin = req.headers.origin;
  if (origin) {console.log('Origin: ' + origin)}
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  return next();
})

var port = process.env.PORT || 5000;

app.get('/', function(req, res) {
  res.send("Looks like things are working OK");
});


app.post('/incomming', function(req, res) {
  // First make sure we have values for the three required fields
  // script, function, types
  console.log('Script: ' + req.body.script);
  console.log('Function: ' + req.body.function);
  console.log('Types: ' + req.body.types);
  (req.body.script && req.body.function && req.body.types ) || res.status(500).send('You need to provide a script, function and types!')
  var name = tmp.tmpNameSync();
  console.log('Created temporary filename: ', name + '.jl');

  // Write the provided script to the temporary file
  fs.writeFileSync(name + '.jl', req.body.script);

  // Call the exporter script, which creates a matching .js file

  //  Need to capture the STDIO output somehow and record it for later use?

  console.log('Calling the julia conversion script...')
  exec('julia /webserver/exporter.jl ' + name + '.jl ' + req.body.function + ' ' + req.body.types, {stdio: 'inherit'}, function(error, stdout, stderr) {
    console.log('Stdout from export script:\n' + stdout);
    if (error) {
      console.log("Someone's request caused some problems...")
      fs.writeFile(name + '.log', error);
    } else {
      console.log('Looks like a conversion script just finished!')
    }
  });

  res.status(202).json({filename: name});

})

app.post('/results', function(req, res) {
  console.log('FileName: ' + req.body.filename);
  (req.body.filename) || res.status(500).send('You need to provide a filename!');
  var name = req.body.filename;

  // Is there a resulting .js file?
  if (fs.existsSync(name + '.js')) {
    // Read the resulting .js file into a javascript variable and return it.
    var js_result = fs.readFileSync(name + '.js', 'utf8');
    console.log("All done, returning the result!")
    res.json({ready: true, data: js_result});
  } else if (fs.existsSync(name + '.log')) {
    // Something went wrong, so let's return some useful error logs
    var error_log = fs.readFileSync(name + '.log', 'utf8');
    res.json({ready: true, error: error_log});
  } else {
    console.log("Someone wants a response for request: " + name + " but it's not ready yet...")
    res.status(200).json({ready: false});
  }

})

// Error handling middleware
app.use(function(err, req, res, next) {
  // Do logging and user-friendly error message display
  console.error(err.toString());
  res.status = 200;
  res.json({error: err.toString()});
});


app.listen(port, function() {
  console.log('Node app is running on port: ', port);
});
