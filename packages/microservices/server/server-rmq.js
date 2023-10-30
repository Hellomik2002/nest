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
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.ServerRMQ = void 0;
var shared_utils_1 = require("@nestjs/common/utils/shared.utils");
var constants_1 = require("../constants");
var ctx_host_1 = require("../ctx-host");
var enums_1 = require("../enums");
var rmq_record_serializer_1 = require("../serializers/rmq-record.serializer");
var server_1 = require("./server");
var rqmPackage = {};
var INFINITE_CONNECTION_ATTEMPTS = -1;
var ServerRMQ = /** @class */ (function (_super) {
    __extends(ServerRMQ, _super);
    function ServerRMQ(options) {
        var _this = _super.call(this) || this;
        _this.options = options;
        _this.transportId = enums_1.Transport.RMQ;
        _this.server = null;
        _this.channel = null;
        _this.connectionAttempts = 0;
        _this.urls = _this.getOptionsProp(_this.options, 'urls') || [constants_1.RQM_DEFAULT_URL];
        _this.queue =
            _this.getOptionsProp(_this.options, 'queue') || constants_1.RQM_DEFAULT_QUEUE;
        _this.prefetchCount =
            _this.getOptionsProp(_this.options, 'prefetchCount') ||
                constants_1.RQM_DEFAULT_PREFETCH_COUNT;
        _this.noAck = _this.getOptionsProp(_this.options, 'noAck', constants_1.RQM_DEFAULT_NOACK);
        _this.isGlobalPrefetchCount =
            _this.getOptionsProp(_this.options, 'isGlobalPrefetchCount') ||
                constants_1.RQM_DEFAULT_IS_GLOBAL_PREFETCH_COUNT;
        _this.queueOptions =
            _this.getOptionsProp(_this.options, 'queueOptions') ||
                constants_1.RQM_DEFAULT_QUEUE_OPTIONS;
        _this.noAssert =
            _this.getOptionsProp(_this.options, 'noAssert') || constants_1.RQM_DEFAULT_NO_ASSERT;
        _this.loadPackage('amqplib', ServerRMQ.name, function () { return require('amqplib'); });
        rqmPackage = _this.loadPackage('amqp-connection-manager', ServerRMQ.name, function () { return require('amqp-connection-manager'); });
        _this.initializeSerializer(options);
        _this.initializeDeserializer(options);
        return _this;
    }
    ServerRMQ.prototype.listen = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.start(callback)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        callback(err_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ServerRMQ.prototype.close = function () {
        this.channel && this.channel.close();
        this.server && this.server.close();
    };
    ServerRMQ.prototype.start = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var maxConnectionAttempts;
            var _this = this;
            return __generator(this, function (_a) {
                this.server = this.createClient();
                this.server.on(constants_1.CONNECT_EVENT, function () {
                    if (_this.channel) {
                        return;
                    }
                    _this.channel = _this.server.createChannel({
                        json: false,
                        setup: function (channel) { return _this.setupChannel(channel, callback); }
                    });
                });
                maxConnectionAttempts = this.getOptionsProp(this.options, 'maxConnectionAttempts', INFINITE_CONNECTION_ATTEMPTS);
                this.server.on(constants_1.DISCONNECT_EVENT, function (err) {
                    _this.logger.error(constants_1.DISCONNECTED_RMQ_MESSAGE);
                    _this.logger.error(err);
                });
                this.server.on(constants_1.CONNECT_FAILED_EVENT, function (error) {
                    var _a;
                    _this.logger.error(constants_1.CONNECTION_FAILED_MESSAGE);
                    if (error === null || error === void 0 ? void 0 : error.err) {
                        _this.logger.error(error.err);
                    }
                    var isReconnecting = !!_this.channel;
                    if (maxConnectionAttempts === INFINITE_CONNECTION_ATTEMPTS ||
                        isReconnecting) {
                        return;
                    }
                    if (++_this.connectionAttempts === maxConnectionAttempts) {
                        _this.close();
                        callback === null || callback === void 0 ? void 0 : callback((_a = error.err) !== null && _a !== void 0 ? _a : new Error(constants_1.CONNECTION_FAILED_MESSAGE));
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    ServerRMQ.prototype.createClient = function () {
        var socketOptions = this.getOptionsProp(this.options, 'socketOptions');
        return rqmPackage.connect(this.urls, {
            connectionOptions: socketOptions,
            heartbeatIntervalInSeconds: socketOptions === null || socketOptions === void 0 ? void 0 : socketOptions.heartbeatIntervalInSeconds,
            reconnectTimeInSeconds: socketOptions === null || socketOptions === void 0 ? void 0 : socketOptions.reconnectTimeInSeconds
        });
    };
    ServerRMQ.prototype.setupChannel = function (channel, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.queueOptions.noAssert) return [3 /*break*/, 2];
                        return [4 /*yield*/, channel.assertQueue(this.queue, this.queueOptions)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, channel.prefetch(this.prefetchCount, this.isGlobalPrefetchCount)];
                    case 3:
                        _a.sent();
                        channel.consume(this.queue, function (msg) { return _this.handleMessage(msg, channel); }, {
                            noAck: this.noAck
                        });
                        callback();
                        return [2 /*return*/];
                }
            });
        });
    };
    ServerRMQ.prototype.handleMessage = function (message, channel) {
        return __awaiter(this, void 0, void 0, function () {
            var content, properties, rawMessage, packet, pattern, rmqContext, handler, status_1, noHandlerPacket, response$, _a, publish;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if ((0, shared_utils_1.isNil)(message)) {
                            return [2 /*return*/];
                        }
                        content = message.content, properties = message.properties;
                        rawMessage = this.parseMessageContent(content);
                        return [4 /*yield*/, this.deserializer.deserialize(rawMessage, properties)];
                    case 1:
                        packet = _b.sent();
                        pattern = (0, shared_utils_1.isString)(packet.pattern)
                            ? packet.pattern
                            : JSON.stringify(packet.pattern);
                        rmqContext = new ctx_host_1.RmqContext([message, channel, pattern]);
                        if ((0, shared_utils_1.isUndefined)(packet.id)) {
                            return [2 /*return*/, this.handleEvent(pattern, packet, rmqContext)];
                        }
                        handler = this.getHandlerByPattern(pattern);
                        if (!handler) {
                            status_1 = 'error';
                            noHandlerPacket = {
                                id: packet.id,
                                err: constants_1.NO_MESSAGE_HANDLER,
                                status: status_1
                            };
                            return [2 /*return*/, this.sendMessage(noHandlerPacket, properties.replyTo, properties.correlationId)];
                        }
                        _a = this.transformToObservable;
                        return [4 /*yield*/, handler(packet.data, rmqContext)];
                    case 2:
                        response$ = _a.apply(this, [_b.sent()]);
                        publish = function (data) {
                            return _this.sendMessage(data, properties.replyTo, properties.correlationId);
                        };
                        response$ && this.send(response$, publish);
                        return [2 /*return*/];
                }
            });
        });
    };
    ServerRMQ.prototype.handleEvent = function (pattern, packet, context) {
        return __awaiter(this, void 0, void 0, function () {
            var handler;
            return __generator(this, function (_a) {
                handler = this.getHandlerByPattern(pattern);
                if (!handler && !this.noAck) {
                    this.channel.nack(context.getMessage(), false, false);
                    return [2 /*return*/, this.logger.warn((0, constants_1.RQM_NO_EVENT_HANDLER)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["", ""], ["", ""])), pattern))];
                }
                return [2 /*return*/, _super.prototype.handleEvent.call(this, pattern, packet, context)];
            });
        });
    };
    ServerRMQ.prototype.sendMessage = function (message, replyTo, correlationId) {
        var outgoingResponse = this.serializer.serialize(message);
        var options = outgoingResponse.options;
        delete outgoingResponse.options;
        var buffer = Buffer.from(JSON.stringify(outgoingResponse));
        this.channel.sendToQueue(replyTo, buffer, __assign({ correlationId: correlationId }, options));
    };
    ServerRMQ.prototype.initializeSerializer = function (options) {
        var _a;
        this.serializer = (_a = options === null || options === void 0 ? void 0 : options.serializer) !== null && _a !== void 0 ? _a : new rmq_record_serializer_1.RmqRecordSerializer();
    };
    ServerRMQ.prototype.parseMessageContent = function (content) {
        try {
            return JSON.parse(content.toString());
        }
        catch (_a) {
            return content.toString();
        }
    };
    return ServerRMQ;
}(server_1.Server));
exports.ServerRMQ = ServerRMQ;
var templateObject_1;
