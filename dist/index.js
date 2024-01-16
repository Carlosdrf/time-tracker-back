"use strict";

require("./database");
var _app = _interopRequireDefault(require("./app"));
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
// import "../models";

var port = 3000;
var host = 'localhost';
// console.log(path.join(__dirname+"/migrations/"))
_app["default"].listen(port, function () {
  console.log("server listening on port http://localhost:".concat(port));
});