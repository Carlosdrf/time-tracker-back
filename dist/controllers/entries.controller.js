"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateEntryById = exports.getUsersEntries = exports.getUserEntriesStatus = exports.getStartedEntry = exports.getEntries = exports.getAllEntries = exports.genNewToken = exports.deleteProductById = exports.createEntry = exports.closeEntry = void 0;
var _Entries = _interopRequireDefault(require("../models/Entries"));
var _User = _interopRequireDefault(require("../models/User"));
var _Report = _interopRequireDefault(require("../models/Report"));
var _Role = _interopRequireDefault(require("../models/Role"));
var format = _interopRequireWildcard(require("../services/utc.format"));
var _moment = _interopRequireDefault(require("moment"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _config = _interopRequireDefault(require("../config"));
var _app = require("../app");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var genNewToken = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(req) {
    var last_active, token, currentTime, diff, role;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _User["default"].verifyLastActive(req.userId);
        case 2:
          last_active = _context.sent;
          currentTime = Date.now();
          last_active = last_active[0].last_active;
          diff = Math.floor((currentTime - last_active.getTime()) / (1000 * 60 * 60)); // console.log(diff)
          if (!(diff === '23')) {
            _context.next = 13;
            break;
          }
          _context.next = 9;
          return _Role["default"].verifyUserRole(req.userId);
        case 9:
          role = _context.sent;
          token = _jsonwebtoken["default"].sign({
            id: req.userId,
            role: role[0].id
          }, _config["default"].SECRET, {
            expiresIn: 86400
          });
          _context.next = 14;
          break;
        case 13:
          token = null;
        case 14:
          return _context.abrupt("return", token);
        case 15:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function genNewToken(_x) {
    return _ref.apply(this, arguments);
  };
}();
exports.genNewToken = genNewToken;
var getEntries = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var token, result;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return genNewToken(req);
        case 2:
          token = _context2.sent;
          if (!(req.role == 1)) {
            _context2.next = 9;
            break;
          }
          _context2.next = 6;
          return _User["default"].getAllEntries();
        case 6:
          result = _context2.sent;
          _context2.next = 12;
          break;
        case 9:
          _context2.next = 11;
          return _Entries["default"].getEntries(req.userId);
        case 11:
          result = _context2.sent;
        case 12:
          res.json({
            result: result,
            token: token
          });
        case 13:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function getEntries(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();
exports.getEntries = getEntries;
var getAllEntries = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var dateRange, result;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return format.UTCformat(req.body.start_time);
        case 2:
          _context3.t0 = _context3.sent;
          _context3.next = 5;
          return format.UTCend(req.body.end_time);
        case 5:
          _context3.t1 = _context3.sent;
          dateRange = {
            start_time: _context3.t0,
            end_time: _context3.t1
          };
          _context3.next = 9;
          return _Entries["default"].getAllEntries(dateRange);
        case 9:
          result = _context3.sent;
          res.json(result);
        case 11:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function getAllEntries(_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();
// users entries
exports.getAllEntries = getAllEntries;
var getUsersEntries = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var user_id, result, dateRange;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          user_id = req.body.user_id;
          if (!(req.body.start_time == null)) {
            _context4.next = 7;
            break;
          }
          _context4.next = 4;
          return _Entries["default"].getEntries(user_id);
        case 4:
          result = _context4.sent;
          _context4.next = 17;
          break;
        case 7:
          _context4.next = 9;
          return format.UTCformat(req.body.start_time);
        case 9:
          _context4.t0 = _context4.sent;
          _context4.next = 12;
          return format.UTCend(req.body.end_time);
        case 12:
          _context4.t1 = _context4.sent;
          dateRange = {
            start_time: _context4.t0,
            end_time: _context4.t1
          };
          _context4.next = 16;
          return _Report["default"].getReport(dateRange, user_id);
        case 16:
          result = _context4.sent;
        case 17:
          res.json(result);
        case 18:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function getUsersEntries(_x6, _x7) {
    return _ref4.apply(this, arguments);
  };
}();
exports.getUsersEntries = getUsersEntries;
var createEntry = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    var date, start_time, taskId, data, result;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          date = (0, _moment["default"])().format('YYYY-MM-DD');
          start_time = (0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'); // console.log(req.body.task)
          _context5.next = 4;
          return _Entries["default"].createTask(req.body.task);
        case 4:
          taskId = _context5.sent;
          data = {
            start_time: start_time,
            end_time: start_time,
            date: date,
            user_id: req.userId,
            status: req.body.status,
            task_id: taskId.insertId
          };
          _context5.next = 8;
          return _Entries["default"].createEntry(data);
        case 8:
          result = _context5.sent;
          // console.log(data)
          if (result) {
            _app.io.emit('server:message', result.insertId);
            _app.io.emit('server:admin:newEntry', [req.userId, data]);
            res.json(result.insertId);
          } else {
            res.json('There was a Trouble');
          }
        case 10:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function createEntry(_x8, _x9) {
    return _ref5.apply(this, arguments);
  };
}();
exports.createEntry = createEntry;
var getStartedEntry = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var startedEntry;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return _Entries["default"].getStartedEntry(req.userId);
        case 2:
          startedEntry = _context6.sent;
          // console.log(startedEntry)
          _app.io.emit('server:message', startedEntry);
          res.json(startedEntry);
        case 5:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return function getStartedEntry(_x10, _x11) {
    return _ref6.apply(this, arguments);
  };
}();
exports.getStartedEntry = getStartedEntry;
var getUserEntriesStatus = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res) {
    var result;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return _Entries["default"].getStartedEntry(req.body.id);
        case 2:
          result = _context7.sent;
          res.json(result);
        case 4:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return function getUserEntriesStatus(_x12, _x13) {
    return _ref7.apply(this, arguments);
  };
}();
exports.getUserEntriesStatus = getUserEntriesStatus;
var updateEntryById = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(req, res) {
    var _req$body, start_time, end_time, date, description, task_id, taskData, entryData, result;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _req$body = req.body, start_time = _req$body.start_time, end_time = _req$body.end_time, date = _req$body.date, description = _req$body.description, task_id = _req$body.task_id; // console.log(description, task_id, date)
          taskData = {
            id: task_id,
            description: description
          };
          _context8.next = 4;
          return _Entries["default"].updateTask(taskData);
        case 4:
          entryData = {
            start_time: (0, _moment["default"])(date).format('YYYY-MM-DD') + ' ' + (0, _moment["default"])(start_time).format('HH:mm:ss'),
            end_time: (0, _moment["default"])(date).format('YYYY-MM-DD') + ' ' + (0, _moment["default"])(end_time).format('HH:mm:ss'),
            date: (0, _moment["default"])(date).format('YYYY-MM-DD')
          }; // console.log(entryData)
          _context8.next = 7;
          return _Entries["default"].updateEntryById(req.params.entryId, entryData);
        case 7:
          result = _context8.sent;
          if (result) {
            res.status(200).json({
              message: 'Updated'
            });
          } else {
            res.status(400).json({
              message: "there whas an error"
            });
          }
        case 9:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return function updateEntryById(_x14, _x15) {
    return _ref8.apply(this, arguments);
  };
}();
exports.updateEntryById = updateEntryById;
var closeEntry = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(req, res) {
    var end_time, entryData, result;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          end_time = req.body.end_time; // console.log(req.userId);
          entryData = {
            end_time: (0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'),
            status: 1
          };
          _context9.next = 4;
          return _Entries["default"].closeCurrentEntry(req.params.entryId, entryData, req.userId);
        case 4:
          result = _context9.sent;
          if (result) {
            _app.io.emit('server:closedEntry', [req.userId, entryData]);
            res.status(200).json({
              message: 'closed'
            });
          } else {
            res.status(400).json({
              message: "there whas an error"
            });
          }
        case 6:
        case "end":
          return _context9.stop();
      }
    }, _callee9);
  }));
  return function closeEntry(_x16, _x17) {
    return _ref9.apply(this, arguments);
  };
}();
exports.closeEntry = closeEntry;
var deleteProductById = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(req, res) {
    var result;
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          _context10.next = 2;
          return _Entries["default"].deleteById(req.params.entryId);
        case 2:
          result = _context10.sent;
          if (result) {
            res.json(result);
          } else {
            res.json('error');
          }
        case 4:
        case "end":
          return _context10.stop();
      }
    }, _callee10);
  }));
  return function deleteProductById(_x18, _x19) {
    return _ref10.apply(this, arguments);
  };
}();
exports.deleteProductById = deleteProductById;