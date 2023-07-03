"use strict";

var _app = _interopRequireDefault(require("./app"));
require("./database");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var port = 3000;
var host = 'localhost';
_app["default"].listen(port, function () {
  console.log("server listening on port http://localhost:".concat(port));
});