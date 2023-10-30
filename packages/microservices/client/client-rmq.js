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
exports.__esModule = true;
exports.ClientRMQ = void 0;
var logger_service_1 = require("@nestjs/common/services/logger.service");
var load_package_util_1 = require("@nestjs/common/utils/load-package.util");
var random_string_generator_util_1 = require("@nestjs/common/utils/random-string-generator.util");
var shared_utils_1 = require("@nestjs/common/utils/shared.utils");
var events_1 = require("events");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var constants_1 = require("../constants");
var rmq_record_serializer_1 = require("../serializers/rmq-record.serializer");
var client_proxy_1 = require("./client-proxy");
var rqmPackage = {};
var REPLY_QUEUE = 'amq.rabbitmq.reply-to';
/**
 * @publicApi
 */
var ClientRMQ = /** @class */ (function (_super) {
    __extends(ClientRMQ, _super);
    function ClientRMQ(options) {
        var _this = _super.call(this) || this;
        _this.options = options;
        _this.logger = new logger_service_1.Logger(client_proxy_1.ClientProxy.name);
        _this.client = null;
        _this.channel = null;
        _this.urls = _this.getOptionsProp(_this.options, 'urls') || [constants_1.RQM_DEFAULT_URL];
        _this.queue =
            _this.getOptionsProp(_this.options, 'queue') || constants_1.RQM_DEFAULT_QUEUE;
        _this.queueOptions =
            _this.getOptionsProp(_this.options, 'queueOptions') ||
                constants_1.RQM_DEFAULT_QUEUE_OPTIONS;
        _this.replyQueue =
            _this.getOptionsProp(_this.options, 'replyQueue') || REPLY_QUEUE;
        _this.persistent =
            _this.getOptionsProp(_this.options, 'persistent') || constants_1.RQM_DEFAULT_PERSISTENT;
        _this.noAssert =
            _this.getOptionsProp(_this.options, 'noAssert') || constants_1.RQM_DEFAULT_NO_ASSERT;
        (0, load_package_util_1.loadPackage)('amqplib', ClientRMQ.name, function () { return require('amqplib'); });
        rqmPackage = (0, load_package_util_1.loadPackage)('amqp-connection-manager', ClientRMQ.name, function () {
            return require('amqp-connection-manager');
        });
        _this.initializeSerializer(options);
        _this.initializeDeserializer(options);
        return _this;
    }
    ClientRMQ.prototype.close = function () {
        this.channel && this.channel.close();
        this.client && this.client.close();
        this.channel = null;
        this.client = null;
    };
    ClientRMQ.prototype.connect = function () {
        var _this = this;
        if (this.client) {
            return this.convertConnectionToPromise();
        }
        this.client = this.createClient();
        this.handleError(this.client);
        this.handleDisconnectError(this.client);
        this.responseEmitter = new events_1.EventEmitter();
        this.responseEmitter.setMaxListeners(0);
        var connect$ = this.connect$(this.client);
        var withDisconnect$ = this.mergeDisconnectEvent(this.client, connect$).pipe((0, operators_1.switchMap)(function () { return _this.createChannel(); }));
        var withReconnect$ = (0, rxjs_1.fromEvent)(this.client, constants_1.CONNECT_EVENT).pipe((0, operators_1.skip)(1));
        var source$ = (0, rxjs_1.merge)(withDisconnect$, withReconnect$);
        this.connection$ = new rxjs_1.ReplaySubject(1);
        source$.subscribe(this.connection$);
        return this.convertConnectionToPromise();
    };
    ClientRMQ.prototype.createChannel = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.channel = _this.client.createChannel({
                json: false,
                setup: function (channel) { return _this.setupChannel(channel, resolve); }
            });
        });
    };
    ClientRMQ.prototype.createClient = function () {
        var socketOptions = this.getOptionsProp(this.options, 'socketOptions');
        return rqmPackage.connect(this.urls, {
            connectionOptions: socketOptions
        });
    };
    ClientRMQ.prototype.mergeDisconnectEvent = function (instance, source$) {
        var eventToError = function (eventType) {
            return (0, rxjs_1.fromEvent)(instance, eventType).pipe((0, operators_1.map)(function (err) {
                throw err;
            }));
        };
        var disconnect$ = eventToError(constants_1.DISCONNECT_EVENT);
        var urls = this.getOptionsProp(this.options, 'urls', []);
        var connectFailed$ = eventToError(constants_1.CONNECT_FAILED_EVENT).pipe((0, operators_1.retryWhen)(function (e) {
            return e.pipe((0, operators_1.scan)(function (errorCount, error) {
                if (urls.indexOf(error.url) >= urls.length - 1) {
                    throw error;
                }
                return errorCount + 1;
            }, 0));
        }));
        // If we ever decide to propagate all disconnect errors & re-emit them through
        // the "connection" stream then comment out "first()" operator.
        return (0, rxjs_1.merge)(source$, disconnect$, connectFailed$).pipe((0, operators_1.first)());
    };
    ClientRMQ.prototype.convertConnectionToPromise = function () {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, rxjs_1.firstValueFrom)(this.connection$)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_1 = _a.sent();
                        if (err_1 instanceof rxjs_1.EmptyError) {
                            return [2 /*return*/];
                        }
                        throw err_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ClientRMQ.prototype.setupChannel = function (channel, resolve) {
        return __awaiter(this, void 0, void 0, function () {
            var prefetchCount, isGlobalPrefetchCount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prefetchCount = this.getOptionsProp(this.options, 'prefetchCount') ||
                            constants_1.RQM_DEFAULT_PREFETCH_COUNT;
                        isGlobalPrefetchCount = this.getOptionsProp(this.options, 'isGlobalPrefetchCount') ||
                            constants_1.RQM_DEFAULT_IS_GLOBAL_PREFETCH_COUNT;
                        if (!!this.queueOptions.noAssert) return [3 /*break*/, 2];
                        return [4 /*yield*/, channel.assertQueue(this.queue, this.queueOptions)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, channel.prefetch(prefetchCount, isGlobalPrefetchCount)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.consumeChannel(channel)];
                    case 4:
                        _a.sent();
                        resolve();
                        return [2 /*return*/];
                }
            });
        });
    };
    ClientRMQ.prototype.consumeChannel = function (channel) {
        return __awaiter(this, void 0, void 0, function () {
            var noAck;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        noAck = this.getOptionsProp(this.options, 'noAck', constants_1.RQM_DEFAULT_NOACK);
                        return [4 /*yield*/, channel.consume(this.replyQueue, function (msg) {
                                return _this.responseEmitter.emit(msg.properties.correlationId, msg);
                            }, {
                                noAck: noAck
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ClientRMQ.prototype.handleError = function (client) {
        var _this = this;
        client.addListener(constants_1.ERROR_EVENT, function (err) { return _this.logger.error(err); });
    };
    ClientRMQ.prototype.handleDisconnectError = function (client) {
        var _this = this;
        client.addListener(constants_1.DISCONNECT_EVENT, function (err) {
            _this.logger.error(constants_1.DISCONNECTED_RMQ_MESSAGE);
            _this.logger.error(err);
        });
    };
    ClientRMQ.prototype.handleMessage = function (packet, options, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, err, response, isDisposed;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if ((0, shared_utils_1.isFunction)(options)) {
                            callback = options;
                            options = undefined;
                        }
                        return [4 /*yield*/, this.deserializer.deserialize(packet, options)];
                    case 1:
                        _a = _b.sent(), err = _a.err, response = _a.response, isDisposed = _a.isDisposed;
                        if (isDisposed || err) {
                            callback({
                                err: err,
                                response: response,
                                isDisposed: true
                            });
                        }
                        callback({
                            err: err,
                            response: response
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    ClientRMQ.prototype.publish = function (message, callback) {
        var _this = this;
        try {
            var correlationId_1 = (0, random_string_generator_util_1.randomStringGenerator)();
            var listener_1 = function (_a) {
                var content = _a.content, options = _a.options;
                return _this.handleMessage(_this.parseMessageContent(content), options, callback);
            };
            Object.assign(message, { id: correlationId_1 });
            var serializedPacket = this.serializer.serialize(message);
            var options = serializedPacket.options;
            delete serializedPacket.options;
            this.responseEmitter.on(correlationId_1, listener_1);
            this.channel
                .sendToQueue(this.queue, Buffer.from(JSON.stringify(serializedPacket)), __assign(__assign({ replyTo: this.replyQueue, persistent: this.persistent }, options), { headers: this.mergeHeaders(options === null || options === void 0 ? void 0 : options.headers), correlationId: correlationId_1 }))["catch"](function (err) { return callback({ err: err }); });
            return function () { return _this.responseEmitter.removeListener(correlationId_1, listener_1); };
        }
        catch (err) {
            callback({ err: err });
        }
    };
    ClientRMQ.prototype.dispatchEvent = function (packet) {
        var _this = this;
        var serializedPacket = this.serializer.serialize(packet);
        var options = serializedPacket.options;
        delete serializedPacket.options;
        return new Promise(function (resolve, reject) {
            return _this.channel.sendToQueue(_this.queue, Buffer.from(JSON.stringify(serializedPacket)), __assign(__assign({ persistent: _this.persistent }, options), { headers: _this.mergeHeaders(options === null || options === void 0 ? void 0 : options.headers) }), function (err) { return (err ? reject(err) : resolve()); });
        });
    };
    ClientRMQ.prototype.initializeSerializer = function (options) {
        var _a;
        this.serializer = (_a = options === null || options === void 0 ? void 0 : options.serializer) !== null && _a !== void 0 ? _a : new rmq_record_serializer_1.RmqRecordSerializer();
    };
    ClientRMQ.prototype.mergeHeaders = function (requestHeaders) {
        var _a, _b;
        if (!requestHeaders && !((_a = this.options) === null || _a === void 0 ? void 0 : _a.headers)) {
            return undefined;
        }
        return __assign(__assign({}, (_b = this.options) === null || _b === void 0 ? void 0 : _b.headers), requestHeaders);
    };
    ClientRMQ.prototype.parseMessageContent = function (content) {
        var rawContent = content.toString();
        try {
            return JSON.parse(rawContent);
        }
        catch (_a) {
            return rawContent;
        }
    };
    return ClientRMQ;
}(client_proxy_1.ClientProxy));
exports.ClientRMQ = ClientRMQ;
