var express = require('express');
var path = require("path");
var app = express();
var history = require('connect-history-api-fallback');
var config = require("./config.json");



var root = path.join(__dirname,"./")
console.log(root);

app.use(express.static(root));
//app.use(history());


app.listen(config.port, function () {
  console.log('server run port is '+config.port);
});
