"use strict";

var _app = _interopRequireDefault(require("./app"));
var _path = _interopRequireDefault(require("path"));
require("./database");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var port = 3000;
var host = 'localhost';
console.log(_path["default"].join(__dirname + "/migrations/"));
_app["default"].listen(port, function () {
  console.log("server listening on port http://localhost:".concat(port));
});