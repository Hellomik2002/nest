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
exports.ServerKafka = void 0;
var logger_service_1 = require("@nestjs/common/services/logger.service");
var shared_utils_1 = require("@nestjs/common/utils/shared.utils");
var rxjs_1 = require("rxjs");
var constants_1 = require("../constants");
var ctx_host_1 = require("../ctx-host");
var kafka_request_deserializer_1 = require("../deserializers/kafka-request.deserializer");
var enums_1 = require("../enums");
var exceptions_1 = require("../exceptions");
var helpers_1 = require("../helpers");
var kafka_request_serializer_1 = require("../serializers/kafka-request.serializer");
var server_1 = require("./server");
var kafkaPackage = {};
var ServerKafka = /** @class */ (function (_super) {
    __extends(ServerKafka, _super);
    function ServerKafka(options) {
        var _this = this;
        var _a;
        _this = _super.call(this) || this;
        _this.options = options;
        _this.transportId = enums_1.Transport.KAFKA;
        _this.logger = new logger_service_1.Logger(ServerKafka.name);
        _this.client = null;
        _this.consumer = null;
        _this.producer = null;
        _this.parser = null;
        var clientOptions = _this.getOptionsProp(_this.options, 'client') || {};
        var consumerOptions = _this.getOptionsProp(_this.options, 'consumer') || {};
        var postfixId = (_a = _this.getOptionsProp(_this.options, 'postfixId')) !== null && _a !== void 0 ? _a : '-server';
        _this.brokers = clientOptions.brokers || [constants_1.KAFKA_DEFAULT_BROKER];
        // append a unique id to the clientId and groupId
        // so they don't collide with a microservices client
        _this.clientId =
            (clientOptions.clientId || constants_1.KAFKA_DEFAULT_CLIENT) + postfixId;
        _this.groupId = (consumerOptions.groupId || constants_1.KAFKA_DEFAULT_GROUP) + postfixId;
        kafkaPackage = _this.loadPackage('kafkajs', ServerKafka.name, function () {
            return require('kafkajs');
        });
        _this.parser = new helpers_1.KafkaParser((options && options.parser) || undefined);
        _this.initializeSerializer(options);
        _this.initializeDeserializer(options);
        return _this;
    }
    ServerKafka.prototype.listen = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.client = this.createClient();
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
    ServerKafka.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this.consumer;
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.consumer.disconnect()];
                    case 1:
                        _a = (_c.sent());
                        _c.label = 2;
                    case 2:
                        _a;
                        _b = this.producer;
                        if (!_b) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.producer.disconnect()];
                    case 3:
                        _b = (_c.sent());
                        _c.label = 4;
                    case 4:
                        _b;
                        this.consumer = null;
                        this.producer = null;
                        this.client = null;
                        return [2 /*return*/];
                }
            });
        });
    };
    ServerKafka.prototype.start = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var consumerOptions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        consumerOptions = Object.assign(this.options.consumer || {}, {
                            groupId: this.groupId
                        });
                        this.consumer = this.client.consumer(consumerOptions);
                        this.producer = this.client.producer(this.options.producer);
                        return [4 /*yield*/, this.consumer.connect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.producer.connect()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.bindEvents(this.consumer)];
                    case 3:
                        _a.sent();
                        callback();
                        return [2 /*return*/];
                }
            });
        });
    };
    ServerKafka.prototype.createClient = function () {
        return new kafkaPackage.Kafka(Object.assign({ logCreator: helpers_1.KafkaLogger.bind(null, this.logger) }, this.options.client, { clientId: this.clientId, brokers: this.brokers }));
    };
    ServerKafka.prototype.bindEvents = function (consumer) {
        return __awaiter(this, void 0, void 0, function () {
            var registeredPatterns, consumerSubscribeOptions, consumerRunOptions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        registeredPatterns = __spreadArray([], this.messageHandlers.keys(), true);
                        consumerSubscribeOptions = this.options.subscribe || {};
                        if (!(registeredPatterns.length > 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.consumer.subscribe(__assign(__assign({}, consumerSubscribeOptions), { topics: registeredPatterns }))];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        consumerRunOptions = Object.assign(this.options.run || {}, {
                            eachMessage: this.getMessageHandler()
                        });
                        return [4 /*yield*/, consumer.run(consumerRunOptions)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ServerKafka.prototype.getMessageHandler = function () {
        var _this = this;
        return function (payload) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, this.handleMessage(payload)];
        }); }); };
    };
    ServerKafka.prototype.getPublisher = function (replyTopic, replyPartition, correlationId) {
        var _this = this;
        return function (data) {
            return _this.sendMessage(data, replyTopic, replyPartition, correlationId);
        };
    };
    ServerKafka.prototype.handleMessage = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, rawMessage, headers, correlationId, replyTopic, replyPartition, packet, kafkaContext, handler, publish, response$, replayStream$;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        channel = payload.topic;
                        rawMessage = this.parser.parse(Object.assign(payload.message, {
                            topic: payload.topic,
                            partition: payload.partition
                        }));
                        headers = rawMessage.headers;
                        correlationId = headers[enums_1.KafkaHeaders.CORRELATION_ID];
                        replyTopic = headers[enums_1.KafkaHeaders.REPLY_TOPIC];
                        replyPartition = headers[enums_1.KafkaHeaders.REPLY_PARTITION];
                        return [4 /*yield*/, this.deserializer.deserialize(rawMessage, { channel: channel })];
                    case 1:
                        packet = _a.sent();
                        kafkaContext = new ctx_host_1.KafkaContext([
                            rawMessage,
                            payload.partition,
                            payload.topic,
                            this.consumer,
                            payload.heartbeat,
                            this.producer,
                        ]);
                        handler = this.getHandlerByPattern(packet.pattern);
                        // if the correlation id or reply topic is not set
                        // then this is an event (events could still have correlation id)
                        if ((handler === null || handler === void 0 ? void 0 : handler.isEventHandler) || !correlationId || !replyTopic) {
                            return [2 /*return*/, this.handleEvent(packet.pattern, packet, kafkaContext)];
                        }
                        publish = this.getPublisher(replyTopic, replyPartition, correlationId);
                        if (!handler) {
                            return [2 /*return*/, publish({
                                    id: correlationId,
                                    err: constants_1.NO_MESSAGE_HANDLER
                                })];
                        }
                        response$ = this.transformToObservable(handler(packet.data, kafkaContext));
                        replayStream$ = new rxjs_1.ReplaySubject();
                        return [4 /*yield*/, this.combineStreamsAndThrowIfRetriable(response$, replayStream$)];
                    case 2:
                        _a.sent();
                        this.send(replayStream$, publish);
                        return [2 /*return*/];
                }
            });
        });
    };
    ServerKafka.prototype.combineStreamsAndThrowIfRetriable = function (response$, replayStream$) {
        return new Promise(function (resolve, reject) {
            var isPromiseResolved = false;
            response$.subscribe({
                next: function (val) {
                    replayStream$.next(val);
                    if (!isPromiseResolved) {
                        isPromiseResolved = true;
                        resolve();
                    }
                },
                error: function (err) {
                    if (err instanceof exceptions_1.KafkaRetriableException && !isPromiseResolved) {
                        isPromiseResolved = true;
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                    replayStream$.error(err);
                },
                complete: function () { return replayStream$.complete(); }
            });
        });
    };
    ServerKafka.prototype.sendMessage = function (message, replyTopic, replyPartition, correlationId) {
        return __awaiter(this, void 0, void 0, function () {
            var outgoingMessage, replyMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.serializer.serialize(message.response)];
                    case 1:
                        outgoingMessage = _a.sent();
                        this.assignReplyPartition(replyPartition, outgoingMessage);
                        this.assignCorrelationIdHeader(correlationId, outgoingMessage);
                        this.assignErrorHeader(message, outgoingMessage);
                        this.assignIsDisposedHeader(message, outgoingMessage);
                        replyMessage = Object.assign({
                            topic: replyTopic,
                            messages: [outgoingMessage]
                        }, this.options.send || {});
                        return [2 /*return*/, this.producer.send(replyMessage)];
                }
            });
        });
    };
    ServerKafka.prototype.assignIsDisposedHeader = function (outgoingResponse, outgoingMessage) {
        if (!outgoingResponse.isDisposed) {
            return;
        }
        outgoingMessage.headers[enums_1.KafkaHeaders.NEST_IS_DISPOSED] = Buffer.alloc(1);
    };
    ServerKafka.prototype.assignErrorHeader = function (outgoingResponse, outgoingMessage) {
        if (!outgoingResponse.err) {
            return;
        }
        var stringifiedError = typeof outgoingResponse.err === 'object'
            ? JSON.stringify(outgoingResponse.err)
            : outgoingResponse.err;
        outgoingMessage.headers[enums_1.KafkaHeaders.NEST_ERR] =
            Buffer.from(stringifiedError);
    };
    ServerKafka.prototype.assignCorrelationIdHeader = function (correlationId, outgoingMessage) {
        outgoingMessage.headers[enums_1.KafkaHeaders.CORRELATION_ID] =
            Buffer.from(correlationId);
    };
    ServerKafka.prototype.assignReplyPartition = function (replyPartition, outgoingMessage) {
        if ((0, shared_utils_1.isNil)(replyPartition)) {
            return;
        }
        outgoingMessage.partition = parseFloat(replyPartition);
    };
    ServerKafka.prototype.handleEvent = function (pattern, packet, context) {
        return __awaiter(this, void 0, void 0, function () {
            var handler, resultOrStream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        handler = this.getHandlerByPattern(pattern);
                        if (!handler) {
                            return [2 /*return*/, this.logger.error((0, constants_1.NO_EVENT_HANDLER)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["", ""], ["", ""])), pattern))];
                        }
                        return [4 /*yield*/, handler(packet.data, context)];
                    case 1:
                        resultOrStream = _a.sent();
                        if (!(0, rxjs_1.isObservable)(resultOrStream)) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, rxjs_1.lastValueFrom)(resultOrStream)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ServerKafka.prototype.initializeSerializer = function (options) {
        this.serializer =
            (options && options.serializer) || new kafka_request_serializer_1.KafkaRequestSerializer();
    };
    ServerKafka.prototype.initializeDeserializer = function (options) {
        var _a;
        this.deserializer = (_a = options === null || options === void 0 ? void 0 : options.deserializer) !== null && _a !== void 0 ? _a : new kafka_request_deserializer_1.KafkaRequestDeserializer();
    };
    return ServerKafka;
}(server_1.Server));
exports.ServerKafka = ServerKafka;
var templateObject_1;
