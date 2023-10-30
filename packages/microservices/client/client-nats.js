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
exports.__esModule = true;
exports.ClientNats = void 0;
var logger_service_1 = require("@nestjs/common/services/logger.service");
var load_package_util_1 = require("@nestjs/common/utils/load-package.util");
var shared_utils_1 = require("@nestjs/common/utils/shared.utils");
var constants_1 = require("../constants");
var nats_response_json_deserializer_1 = require("../deserializers/nats-response-json.deserializer");
var empty_response_exception_1 = require("../errors/empty-response.exception");
var nats_record_serializer_1 = require("../serializers/nats-record.serializer");
var client_proxy_1 = require("./client-proxy");
var natsPackage = {};
/**
 * @publicApi
 */
var ClientNats = /** @class */ (function (_super) {
    __extends(ClientNats, _super);
    function ClientNats(options) {
        var _this = _super.call(this) || this;
        _this.options = options;
        _this.logger = new logger_service_1.Logger(ClientNats.name);
        natsPackage = (0, load_package_util_1.loadPackage)('nats', ClientNats.name, function () { return require('nats'); });
        _this.initializeSerializer(options);
        _this.initializeDeserializer(options);
        return _this;
    }
    ClientNats.prototype.close = function () {
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
    ClientNats.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.natsClient) {
                            return [2 /*return*/, this.natsClient];
                        }
                        _a = this;
                        return [4 /*yield*/, this.createClient()];
                    case 1:
                        _a.natsClient = _b.sent();
                        this.handleStatusUpdates(this.natsClient);
                        return [2 /*return*/, this.natsClient];
                }
            });
        });
    };
    ClientNats.prototype.createClient = function () {
        var options = this.options || {};
        return natsPackage.connect(__assign({ servers: constants_1.NATS_DEFAULT_URL }, options));
    };
    ClientNats.prototype.handleStatusUpdates = function (client) {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var _d, _e, _f, status_1, data, e_1_1;
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
                            status_1 = _c;
                            data = status_1.data && (0, shared_utils_1.isObject)(status_1.data)
                                ? JSON.stringify(status_1.data)
                                : status_1.data;
                            switch (status_1.type) {
                                case 'error':
                                case 'disconnect':
                                    this.logger.error("NatsError: type: \"".concat(status_1.type, "\", data: \"").concat(data, "\"."));
                                    break;
                                case 'pingTimer':
                                    if (this.options.debug) {
                                        this.logger.debug("NatsStatus: type: \"".concat(status_1.type, "\", data: \"").concat(data, "\"."));
                                    }
                                    break;
                                default:
                                    this.logger.log("NatsStatus: type: \"".concat(status_1.type, "\", data: \"").concat(data, "\"."));
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
    ClientNats.prototype.createSubscriptionHandler = function (packet, callback) {
        var _this = this;
        return function (error, natsMsg) { return __awaiter(_this, void 0, void 0, function () {
            var rawPacket, message, err, response, isDisposed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (error) {
                            return [2 /*return*/, callback({
                                    err: error
                                })];
                        }
                        rawPacket = natsMsg.data;
                        if ((rawPacket === null || rawPacket === void 0 ? void 0 : rawPacket.length) === 0) {
                            return [2 /*return*/, callback({
                                    err: new empty_response_exception_1.EmptyResponseException(this.normalizePattern(packet.pattern)),
                                    isDisposed: true
                                })];
                        }
                        return [4 /*yield*/, this.deserializer.deserialize(rawPacket)];
                    case 1:
                        message = _a.sent();
                        if (message.id && message.id !== packet.id) {
                            return [2 /*return*/, undefined];
                        }
                        err = message.err, response = message.response, isDisposed = message.isDisposed;
                        if (isDisposed || err) {
                            return [2 /*return*/, callback({
                                    err: err,
                                    response: response,
                                    isDisposed: true
                                })];
                        }
                        callback({
                            err: err,
                            response: response
                        });
                        return [2 /*return*/];
                }
            });
        }); };
    };
    ClientNats.prototype.publish = function (partialPacket, callback) {
        try {
            var packet = this.assignPacketId(partialPacket);
            var channel = this.normalizePattern(partialPacket.pattern);
            var serializedPacket = this.serializer.serialize(packet);
            var inbox = natsPackage.createInbox();
            var subscriptionHandler = this.createSubscriptionHandler(packet, callback);
            var subscription_1 = this.natsClient.subscribe(inbox, {
                callback: subscriptionHandler
            });
            var headers = this.mergeHeaders(serializedPacket.headers);
            this.natsClient.publish(channel, serializedPacket.data, {
                reply: inbox,
                headers: headers
            });
            return function () { return subscription_1.unsubscribe(); };
        }
        catch (err) {
            callback({ err: err });
        }
    };
    ClientNats.prototype.dispatchEvent = function (packet) {
        var _this = this;
        var pattern = this.normalizePattern(packet.pattern);
        var serializedPacket = this.serializer.serialize(packet);
        var headers = this.mergeHeaders(serializedPacket.headers);
        return new Promise(function (resolve, reject) {
            try {
                _this.natsClient.publish(pattern, serializedPacket.data, {
                    headers: headers
                });
                resolve();
            }
            catch (err) {
                reject(err);
            }
        });
    };
    ClientNats.prototype.initializeSerializer = function (options) {
        var _a;
        this.serializer = (_a = options === null || options === void 0 ? void 0 : options.serializer) !== null && _a !== void 0 ? _a : new nats_record_serializer_1.NatsRecordSerializer();
    };
    ClientNats.prototype.initializeDeserializer = function (options) {
        var _a;
        this.deserializer =
            (_a = options === null || options === void 0 ? void 0 : options.deserializer) !== null && _a !== void 0 ? _a : new nats_response_json_deserializer_1.NatsResponseJSONDeserializer();
    };
    ClientNats.prototype.mergeHeaders = function (requestHeaders) {
        var _a, _b;
        if (!requestHeaders && !((_a = this.options) === null || _a === void 0 ? void 0 : _a.headers)) {
            return undefined;
        }
        var headers = requestHeaders !== null && requestHeaders !== void 0 ? requestHeaders : natsPackage.headers();
        for (var _i = 0, _c = Object.entries(((_b = this.options) === null || _b === void 0 ? void 0 : _b.headers) || {}); _i < _c.length; _i++) {
            var _d = _c[_i], key = _d[0], value = _d[1];
            if (!headers.has(key)) {
                headers.set(key, value);
            }
        }
        return headers;
    };
    return ClientNats;
}(client_proxy_1.ClientProxy));
exports.ClientNats = ClientNats;
