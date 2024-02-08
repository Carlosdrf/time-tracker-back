"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.report = exports.getRange = exports.controller = exports.UTCformat = exports.UTCend = void 0;
var _nodeFetch = _interopRequireDefault(require("node-fetch"));
var _Report = _interopRequireDefault(require("../models/Report"));
var _momentTimezone = _interopRequireDefault(require("moment-timezone"));
var _fs = _interopRequireDefault(require("fs"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; } // import e from "express";
var excel = require('excel4node');
var path = require('path');
var report = /*#__PURE__*/function () {
  var _cronReport = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          console.log('cron test');
          _context.next = 3;
          return (0, _nodeFetch["default"])('http://localhost:3001/email', {
            method: 'POST',
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify({
              message: 'mensaje para enviar'
            })
          }).then(function (res) {
            return console.log("nodemailer response: ".concat(res.status));
          })["catch"](function (err) {
            return console.log(err);
          });
        case 3:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  function cronReport() {
    return _cronReport.apply(this, arguments);
  }
  return cronReport;
}();
exports.report = report;
var UTCformat = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(date) {
    var receivedDate, utc;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          receivedDate = new Date(date);
          utc = new Date(receivedDate.getUTCFullYear(), receivedDate.getUTCMonth(), receivedDate.getDate(), 4, 0, 0);
          return _context2.abrupt("return", utc.toISOString());
        case 3:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function UTCformat(_x) {
    return _ref.apply(this, arguments);
  };
}();
exports.UTCformat = UTCformat;
var UTCend = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(date) {
    var receivedDate, utc;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          receivedDate = new Date(date);
          console.log(receivedDate);
          utc = new Date(receivedDate.getUTCFullYear(), receivedDate.getUTCMonth(), receivedDate.getDate() + 1, 3, 59, 0);
          return _context3.abrupt("return", utc.toISOString());
        case 4:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function UTCend(_x2) {
    return _ref2.apply(this, arguments);
  };
}();
exports.UTCend = UTCend;
var getRange = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var end_time, start_time, dateRange, row, _row, _row2;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          // const [firstSelect, lastSelect] = req.body
          console.log(req.body);
          _context4.next = 3;
          return UTCend(req.body.lastSelect);
        case 3:
          end_time = _context4.sent;
          _context4.next = 6;
          return UTCformat(req.body.firstSelect);
        case 6:
          start_time = _context4.sent;
          dateRange = {
            start_time: start_time,
            end_time: end_time
          };
          console.log(dateRange);
          if (!((req.role == 1 || req.role == 3) && req.body.user_id == null)) {
            _context4.next = 16;
            break;
          }
          _context4.next = 12;
          return _Report["default"].getReport(dateRange);
        case 12:
          row = _context4.sent;
          res.json(row);
          _context4.next = 27;
          break;
        case 16:
          if (!((req.role == 1 || req.role == 3) && req.body.user_id !== null)) {
            _context4.next = 23;
            break;
          }
          _context4.next = 19;
          return _Report["default"].getReport(dateRange, req.body.user_id);
        case 19:
          _row = _context4.sent;
          res.json(_row);
          _context4.next = 27;
          break;
        case 23:
          _context4.next = 25;
          return _Report["default"].getReport(dateRange, req.userId);
        case 25:
          _row2 = _context4.sent;
          res.json(_row2);
        case 27:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function getRange(_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();
exports.getRange = getRange;
var controller = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    var end_time, start_time, dateRange, workbook, nombreArchivo, worksheet, hdColumnStyle, contColumnStyle, row, i, name, xlPath;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          console.log(req.body);
          _context5.next = 3;
          return UTCend(req.body.lastSelect);
        case 3:
          end_time = _context5.sent;
          _context5.next = 6;
          return UTCformat(req.body.firstSelect);
        case 6:
          start_time = _context5.sent;
          dateRange = {
            start_time: start_time,
            end_time: end_time
          }; // res.json(test)
          // return 0
          workbook = new excel.Workbook();
          nombreArchivo = "report i-nimble";
          worksheet = workbook.addWorksheet(nombreArchivo); // estilos
          hdColumnStyle = workbook.createStyle({
            font: {
              name: 'Arial',
              color: '#000000',
              size: 12,
              bold: true
            },
            border: {
              right: {
                style: 'medium',
                color: '#000000'
              }
            }
          });
          contColumnStyle = workbook.createStyle({
            font: {
              name: 'Arial',
              color: '#000000',
              size: 11
              // bold: true,
            },

            border: {
              right: {
                style: 'thin',
                color: '#000000'
              }
            }
          });
          if (!(req.role == 1 && req.body.user_id == null)) {
            _context5.next = 19;
            break;
          }
          _context5.next = 16;
          return _Report["default"].getReport(dateRange);
        case 16:
          row = _context5.sent;
          _context5.next = 28;
          break;
        case 19:
          if (!(req.role == 1 && req.body.user_id !== null)) {
            _context5.next = 25;
            break;
          }
          _context5.next = 22;
          return _Report["default"].getReport(dateRange, req.body.user_id);
        case 22:
          row = _context5.sent;
          _context5.next = 28;
          break;
        case 25:
          _context5.next = 27;
          return _Report["default"].getReport(dateRange, req.userId);
        case 27:
          row = _context5.sent;
        case 28:
          // nombres columnas
          worksheet.cell(1, 1).string('User').style(hdColumnStyle);
          // worksheet.cell(1,2).string('Apellido').style(hdColumnStyle)
          worksheet.cell(1, 3).string('Date').style(hdColumnStyle);
          worksheet.cell(1, 4).string('Start time').style(hdColumnStyle);
          worksheet.cell(1, 5).string('End time').style(hdColumnStyle);
          worksheet.cell(1, 6).string('Total Hours').style(hdColumnStyle);
          worksheet.cell(1, 7).string('Comments').style(hdColumnStyle);
          // worksheet.cell(2, 1).string(row[0].name + ' ' + row[0].last_name).style(contColumnStyle)
          i = 2;
          row.forEach(function (element) {
            // worksheet.cell(i, 1).string(element.name).style(contColumnStyle)
            // worksheet.cell(i, 2).string(element.last_name).style(contColumnStyle)
            // worksheet.cell(i, 1).string(element.name+' '+element.last_name).style(contColumnStyle)
            if (name) {
              if (name !== element.name) {
                worksheet.cell(i, 1).string(element.name + ' ' + element.last_name).style(contColumnStyle);
              }
            } else {
              worksheet.cell(i, 1).string(element.name + ' ' + element.last_name).style(contColumnStyle);
            }
            var test = _momentTimezone["default"].tz(element.start_time, 'America/Caracas').format('HH:mm:ss');
            console.log(test);
            worksheet.cell(i, 2).string(_momentTimezone["default"].tz(element.start_time, 'America/Caracas').format('dddd')).style(contColumnStyle);
            worksheet.cell(i, 3).string(_momentTimezone["default"].tz(element.start_time, 'America/Caracas').format('DD-MM-YYYY')).style(contColumnStyle);
            worksheet.cell(i, 4).string(_momentTimezone["default"].tz(element.start_time, 'America/Caracas').format('HH:mm:ss')).style(contColumnStyle);
            worksheet.cell(i, 5).string(_momentTimezone["default"].tz(element.end_time, 'America/Caracas').format('HH:mm:ss')).style(contColumnStyle);
            worksheet.cell(i, 6).string(getTotalHours(element.start_time, element.end_time)).style(contColumnStyle);
            worksheet.cell(i, 7).string(element.description).style(contColumnStyle);
            // console.log(element.name)
            name = element.name;
            i = i + 1;
          });
          // ruta donde se guardara
          xlPath = path.join(__dirname, '../../excel', nombreArchivo + '.xlsx'); // escribir
          workbook.write(xlPath, function (err, status) {
            if (err) {
              console.error(err);
            } else {
              // function downloadFile(){res.download(xlPath)}
              // downloadFile()
              // console.log('archivo descargado')
              // res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
              // res.setHeader('Content-Disposition', 'attachment; filename='+ nombreArchivo +'.xlsx');
              // res.setHeader('Content-Length', status.length);
              res.sendFile(xlPath, function (err) {
                if (err) {
                  console.error(err);
                } else {
                  _fs["default"].unlink(xlPath, function (err) {
                    if (err) {
                      console.error('error');
                    } else {
                      console.log('eloo');
                    }
                  });
                }
              });
              // delete file

              // try {
              //     fs.unlinkSync(xlPath)
              // } catch (error) {
              //     console.error('error')
              // }

              // fs.rm(xlPath, function(err){
              //     if(err) console.error(err);
              //     else console.log('archivo eliminado')
              // });
            }
          });
          // worksheet.columns = [
          //     { header: 'Id', key: 'id', width: 10},
          //     { header: 'name', key: 'name', width: 32},
          //     { header: 'hours', key: 'hours', width: 10}
          // ]
          // workbook.eachSheet(function(worksheer, 1))
          // res.json('descargado')
        case 38:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function controller(_x5, _x6) {
    return _ref4.apply(this, arguments);
  };
}();
// module.exports = {run: cronReport};
exports.controller = controller;
function getTotalHours(start_time, end_time) {
  var start = start_time.getTime();
  var endt = end_time.getTime();
  var diff = endt - start;
  var hours = Math.floor(diff / 1000 / 60 / 60);
  var minutes = Math.floor(diff / 1000 / 60 % 60);
  var seconds = Math.floor(diff / 1000 % 60);
  return padZero(hours) + ':' + padZero(minutes) + ':' + padZero(seconds);
}
function padZero(num) {
  return num < 10 ? "0".concat(num) : "".concat(num);
}