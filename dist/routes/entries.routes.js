"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var entriesController = _interopRequireWildcard(require("../controllers/entries.controller"));
var _middlewares = require("../middlewares");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var router = (0, _express.Router)();
router.get('/', _middlewares.authJwt.verifyToken, entriesController.getEntries);
router.post('/all', _middlewares.authJwt.verifyToken, entriesController.getAllEntries);
router.post('/user', _middlewares.authJwt.verifyToken, entriesController.getUsersEntries);
router.post('/users/status', _middlewares.authJwt.verifyToken, entriesController.getUserEntriesStatus);

// router.post('/users', authJwt.verifyToken, entriesController.getUsers)

router.get('/closeEntry/:entryId', _middlewares.authJwt.verifyToken, entriesController.closeEntry);
router.post('/', [_middlewares.authJwt.verifyToken, _middlewares.authJwt.isEmployee], entriesController.createEntry);
router.put('/:entryId', [_middlewares.authJwt.verifyToken, _middlewares.authJwt.isAdmin], entriesController.updateEntryById);
router.put('/task/:task_id', [_middlewares.authJwt.verifyToken], entriesController.updateTaskById);
router["delete"]('/:entryId', [_middlewares.authJwt.verifyToken, _middlewares.authJwt.isEmployee], entriesController.deleteProductById);
router.get('/started', _middlewares.authJwt.verifyToken, entriesController.getStartedEntry);
var _default = router;
exports["default"] = _default;