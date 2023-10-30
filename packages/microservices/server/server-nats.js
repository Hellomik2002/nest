"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.ServerNats = void 0;
var shared_utils_1 = require("@nestjs/common/utils/shared.utils");
var constants_1 = require("../constants");
var nats_context_1 = require("../ctx-host/nats.context");
var nats_request_json_deserializer_1 = require("../deserializers/nats-request-json.deserializer");
var enums_1 = require("../enums");
var nats_record_serializer_1 = require("../serializers/nats-record.serializer");
var server_1 = require("./server");
var natsPackage = {};
var ServerNats = /** @class */ (function (_super) {
    __extends(ServerNats, _super);
    function ServerNats(options) {
        var _this = _super.call(this) || this;
        _this.options = options;
        _this.transportId = enums_1.Transport.NATS;
        natsPackage = _this.loadPackage('nats', ServerNats.name, function () {
            return require('nats');
        });
        _this.initializeSerializer(options);
        _this.initializeDeserializer(options);
        return _this;
    }
    ServerNats.prototype.listen = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = this;
                        return [4 /*yield*/, this.createNatsClient()];
                    case 1:
                        _a.natsClient = _b.sent();
                        this.handleStatusUpdates(this.natsClient);
                        this.start(callback);
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _b.sent();
                        callback(err_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ServerNats.prototype.start = function (callback) {
        this.bindEvents(this.natsClient);
        callback();
    };
    ServerNats.prototype.bindEvents = function (client) {
        var _this = this;
        var queue = this.getOptionsProp(this.options, 'queue');
        var subscribe = function (channel) {
            return client.subscribe(channel, {
                queue: queue,
                callback: _this.getMessageHandler(channel).bind(_this)
            });
        };
        var registeredPatterns = __spreadArray([], this.messageHandlers.keys(), true);
        registeredPatterns.forEach(function (channel) { return subscribe(channel); });
    };
    ServerNats.prototype.close = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, ((_a = this.natsClient) === null || _a === void 0 ? void 0 : _a.close())];
                    case 1:
                        _b.sent();
                        this.natsClient = null;
                        return [2 /*return*/];
                }
            });
        });
    };
    ServerNats.prototype.createNatsClient = function () {
        var options = this.options || {};
        return natsPackage.connect(__assign({ servers: constants_1.NATS_DEFAULT_URL }, options));
    };
    ServerNats.prototype.getMessageHandler = function (channel) {
        var _this = this;
        return function (error, message) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (error) {
                    return [2 /*return*/, this.logger.error(error)];
                }
                return [2 /*return*/, this.handleMessage(channel, message)];
            });
        }); };
    };
    ServerNats.prototype.handleMessage = function (channel, natsMsg) {
        return __awaiter(this, void 0, void 0, function () {
            var callerSubject, rawMessage, replyTo, natsCtx, message, publish, handler, status_1, noHandlerPacket, response$, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        callerSubject = natsMsg.subject;
                        rawMessage = natsMsg.data;
                        replyTo = natsMsg.reply;
                        natsCtx = new nats_context_1.NatsContext([callerSubject, natsMsg.headers]);
                        return [4 /*yield*/, this.deserializer.deserialize(rawMessage, {
                                channel: channel,
                                replyTo: replyTo
                            })];
                    case 1:
                        message = _b.sent();
                        if ((0, shared_utils_1.isUndefined)(message.id)) {
                            return [2 /*return*/, this.handleEvent(channel, message, natsCtx)];
                        }
                        publish = this.getPublisher(natsMsg, message.id);
                        handler = this.getHandlerByPattern(channel);
                        if (!handler) {
                            status_1 = 'error';
                            noHandlerPacket = {
                                id: message.id,
                                status: status_1,
                                err: constants_1.NO_MESSAGE_HANDLER
                            };
                            return [2 /*return*/, publish(noHandlerPacket)];
                        }
                        _a = this.transformToObservable;
                        return [4 /*yield*/, handler(message.data, natsCtx)];
                    case 2:
                        response$ = _a.apply(this, [_b.sent()]);
                        response$ && this.send(response$, publish);
                        return [2 /*return*/];
                }
            });
        });
    };
    ServerNats.prototype.getPublisher = function (natsMsg, id) {
        var _this = this;
        if (natsMsg.reply) {
            return function (response) {
                Object.assign(response, { id: id });
                var outgoingResponse = _this.serializer.serialize(response);
                return natsMsg.respond(outgoingResponse.data, {
                    headers: outgoingResponse.headers
                });
            };
        }
        // In case the "reply" topic is not provided, there's no need for a reply.
        // Method returns a noop function instead
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        return function () { };
    };
    ServerNats.prototype.handleStatusUpdates = function (client) {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var _d, _e, _f, status_2, data, e_1_1;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _g.trys.push([0, 5, 6, 11]);
                        _d = true, _e = __asyncValues(client.status());
                        _g.label = 1;
                    case 1: return [4 /*yield*/, _e.next()];
                    case 2:
                        if (!(_f = _g.sent(), _a = _f.done, !_a)) return [3 /*break*/, 4];
                        _c = _f.value;
                        _d = false;
                        try {
                            status_2 = _c;
                            data = status_2.data && (0, shared_utils_1.isObject)(status_2.data)
                                ? JSON.stringify(status_2.data)
                                : status_2.data;
                            switch (status_2.type) {
                                case 'error':
                                case 'disconnect':
                                    this.logger.error("NatsError: type: \"".concat(status_2.type, "\", data: \"").concat(data, "\"."));
                                    break;
                                case 'pingTimer':
                                    if (this.options.debug) {
                                        this.logger.debug("NatsStatus: type: \"".concat(status_2.type, "\", data: \"").concat(data, "\"."));
                                    }
                                    break;
                                default:
                                    this.logger.log("NatsStatus: type: \"".concat(status_2.type, "\", data: \"").concat(data, "\"."));
                                    break;
                            }
                        }
                        finally {
                            _d = true;
                        }
                        _g.label = 3;
                    case 3: return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 11];
                    case 5:
                        e_1_1 = _g.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 11];
                    case 6:
                        _g.trys.push([6, , 9, 10]);
                        if (!(!_d && !_a && (_b = _e["return"]))) return [3 /*break*/, 8];
                        return [4 /*yield*/, _b.call(_e)];
                    case 7:
                        _g.sent();
                        _g.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 10: return [7 /*endfinally*/];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    ServerNats.prototype.initializeSerializer = function (options) {
        var _a;
        this.serializer = (_a = options === null || options === void 0 ? void 0 : options.serializer) !== null && _a !== void 0 ? _a : new nats_record_serializer_1.NatsRecordSerializer();
    };
    ServerNats.prototype.initializeDeserializer = function (options) {
        var _a;
        this.deserializer =
            (_a = options === null || options === void 0 ? void 0 : options.deserializer) !== null && _a !== void 0 ? _a : new nats_request_json_deserializer_1.NatsRequestJSONDeserializer();
    };
    return ServerNats;
}(server_1.Server));
exports.ServerNats = ServerNats;
