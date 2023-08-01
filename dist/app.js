"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.io = exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _socket = require("socket.io");
var _stripe = require("stripe");
var _http = _interopRequireDefault(require("http"));
var _morgan = _interopRequireDefault(require("morgan"));
var _entries = _interopRequireDefault(require("./routes/entries.routes"));
var _auth = _interopRequireDefault(require("./routes/auth.routes"));
var _reports = _interopRequireDefault(require("./routes/reports.routes"));
var _stripe2 = _interopRequireDefault(require("./routes/stripe.routes"));
var _users = _interopRequireDefault(require("./routes/users.routes"));
var _roles = _interopRequireDefault(require("./routes/roles.routes"));
var _initialSetup = require("./libs/initialSetup");
var _cors = _interopRequireDefault(require("cors"));
var cronReport = _interopRequireWildcard(require("./controllers/report.cron"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var stripe = (0, _stripe.Stripe)('sk_test_4eC39HqLyjWDarjtT1zdp7dc');
var cron = require('node-cron');
// const {run: cronReport} = require('./controllers/report.cron')
// const stripe =
var app = (0, _express["default"])();
var server = _http["default"].createServer(app);
var io = new _socket.Server(server, {
  cors: true,
  origins: ['*']
});
exports.io = io;
io.on('connection', function (socket) {
  var userID;
  console.log('listening web socket');
  socket.on('client:joinRoom', function (email) {
    socket.join(email);
    userID = email;
    console.log('just joined, welcome ', email);
  });
  socket.on('client:timer', function (data) {
    console.log(userID);
    socket.broadcast.to(userID).emit('server:timer', data);
  });
  socket.on('client:loadEntries', function (data) {
    socket.broadcast.to(userID).emit('server:getEntries', data);
  });
  socket.on('client:closedEntry', function (data) {
    console.log('hello');
  });
});
(0, _initialSetup.createRoles)();
// insertRoles();
app.use((0, _cors["default"])());
app.use((0, _morgan["default"])('dev'));
app.use(_express["default"].json());
app.use('/api/stripe', _stripe2["default"]);
app.use('/api/entries', _entries["default"]);
app.use('/api/auth', _auth["default"]);
app.use('/api/reports', _reports["default"]);
app.use('/api/users', _users["default"]);
app.use('/api/roles', _roles["default"]);
// cron.schedule('* * * * *', cronReport.report)
var _default = server;
exports["default"] = _default;