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
exports.ClientKafka = void 0;
var logger_service_1 = require("@nestjs/common/services/logger.service");
var load_package_util_1 = require("@nestjs/common/utils/load-package.util");
var shared_utils_1 = require("@nestjs/common/utils/shared.utils");
var constants_1 = require("../constants");
var kafka_response_deserializer_1 = require("../deserializers/kafka-response.deserializer");
var enums_1 = require("../enums");
var invalid_kafka_client_topic_exception_1 = require("../errors/invalid-kafka-client-topic.exception");
var helpers_1 = require("../helpers");
var kafka_request_serializer_1 = require("../serializers/kafka-request.serializer");
var client_proxy_1 = require("./client-proxy");
var kafkaPackage = {};
/**
 * @publicApi
 */
var ClientKafka = /** @class */ (function (_super) {
    __extends(ClientKafka, _super);
    function ClientKafka(options) {
        var _this = _super.call(this) || this;
        _this.options = options;
        _this.logger = new logger_service_1.Logger(ClientKafka.name);
        _this.client = null;
        _this.consumer = null;
        _this.producer = null;
        _this.parser = null;
        _this.initialized = null;
        _this.responsePatterns = [];
        _this.consumerAssignments = {};
        var clientOptions = _this.getOptionsProp(_this.options, 'client', {});
        var consumerOptions = _this.getOptionsProp(_this.options, 'consumer', {});
        var postfixId = _this.getOptionsProp(_this.options, 'postfixId', '-client');
        _this.producerOnlyMode = _this.getOptionsProp(_this.options, 'producerOnlyMode', false);
        _this.brokers = clientOptions.brokers || [constants_1.KAFKA_DEFAULT_BROKER];
        // Append a unique id to the clientId and groupId
        // so they don't collide with a microservices client
        _this.clientId =
            (clientOptions.clientId || constants_1.KAFKA_DEFAULT_CLIENT) + postfixId;
        _this.groupId = (consumerOptions.groupId || constants_1.KAFKA_DEFAULT_GROUP) + postfixId;
        kafkaPackage = (0, load_package_util_1.loadPackage)('kafkajs', ClientKafka.name, function () {
            return require('kafkajs');
        });
        _this.parser = new helpers_1.KafkaParser((options && options.parser) || undefined);
        _this.initializeSerializer(options);
        _this.initializeDeserializer(options);
        return _this;
    }
    ClientKafka.prototype.subscribeToResponseOf = function (pattern) {
        var request = this.normalizePattern(pattern);
        this.responsePatterns.push(this.getResponsePatternName(request));
    };
    ClientKafka.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this.producer;
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.producer.disconnect()];
                    case 1:
                        _a = (_c.sent());
                        _c.label = 2;
                    case 2:
                        _a;
                        _b = this.consumer;
                        if (!_b) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.consumer.disconnect()];
                    case 3:
                        _b = (_c.sent());
                        _c.label = 4;
                    case 4:
                        _b;
                        this.producer = null;
                        this.consumer = null;
                        this.initialized = null;
                        this.client = null;
                        return [2 /*return*/];
                }
            });
        });
    };
    ClientKafka.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.initialized) {
                    return [2 /*return*/, this.initialized.then(function () { return _this.producer; })];
                }
                this.initialized = new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var partitionAssigners, consumerOptions, err_1;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 5, , 6]);
                                this.client = this.createClient();
                                if (!!this.producerOnlyMode) return [3 /*break*/, 3];
                                partitionAssigners = [
                                    function (config) { return new helpers_1.KafkaReplyPartitionAssigner(_this, config); },
                                ];
                                consumerOptions = Object.assign({
                                    partitionAssigners: partitionAssigners
                                }, this.options.consumer || {}, {
                                    groupId: this.groupId
                                });
                                this.consumer = this.client.consumer(consumerOptions);
                                // set member assignments on join and rebalance
                                this.consumer.on(this.consumer.events.GROUP_JOIN, this.setConsumerAssignments.bind(this));
                                return [4 /*yield*/, this.consumer.connect()];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, this.bindTopics()];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3:
                                this.producer = this.client.producer(this.options.producer || {});
                                return [4 /*yield*/, this.producer.connect()];
                            case 4:
                                _a.sent();
                                resolve();
                                return [3 /*break*/, 6];
                            case 5:
                                err_1 = _a.sent();
                                reject(err_1);
                                return [3 /*break*/, 6];
                            case 6: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/, this.initialized.then(function () { return _this.producer; })];
            });
        });
    };
    ClientKafka.prototype.bindTopics = function () {
        return __awaiter(this, void 0, void 0, function () {
            var consumerSubscribeOptions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.consumer) {
                            throw Error('No consumer initialized');
                        }
                        consumerSubscribeOptions = this.options.subscribe || {};
                        if (!(this.responsePatterns.length > 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.consumer.subscribe(__assign(__assign({}, consumerSubscribeOptions), { topics: this.responsePatterns }))];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.consumer.run(Object.assign(this.options.run || {}, {
                            eachMessage: this.createResponseCallback()
                        }))];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ClientKafka.prototype.createClient = function () {
        var kafkaConfig = Object.assign({ logCreator: helpers_1.KafkaLogger.bind(null, this.logger) }, this.options.client, { brokers: this.brokers, clientId: this.clientId });
        return new kafkaPackage.Kafka(kafkaConfig);
    };
    ClientKafka.prototype.createResponseCallback = function () {
        var _this = this;
        return function (payload) { return __awaiter(_this, void 0, void 0, function () {
            var rawMessage, _a, err, response, isDisposed, id, callback;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        rawMessage = this.parser.parse(Object.assign(payload.message, {
                            topic: payload.topic,
                            partition: payload.partition
                        }));
                        if ((0, shared_utils_1.isUndefined)(rawMessage.headers[enums_1.KafkaHeaders.CORRELATION_ID])) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.deserializer.deserialize(rawMessage)];
                    case 1:
                        _a = _b.sent(), err = _a.err, response = _a.response, isDisposed = _a.isDisposed, id = _a.id;
                        callback = this.routingMap.get(id);
                        if (!callback) {
                            return [2 /*return*/];
                        }
                        if (err || isDisposed) {
                            return [2 /*return*/, callback({
                                    err: err,
                                    response: response,
                                    isDisposed: isDisposed
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
    ClientKafka.prototype.getConsumerAssignments = function () {
        return this.consumerAssignments;
    };
    ClientKafka.prototype.dispatchEvent = function (packet) {
        return __awaiter(this, void 0, void 0, function () {
            var pattern, outgoingEvent, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pattern = this.normalizePattern(packet.pattern);
                        return [4 /*yield*/, this.serializer.serialize(packet.data, {
                                pattern: pattern
                            })];
                    case 1:
                        outgoingEvent = _a.sent();
                        message = Object.assign({
                            topic: pattern,
                            messages: [outgoingEvent]
                        }, this.options.send || {});
                        return [2 /*return*/, this.producer.send(message)];
                }
            });
        });
    };
    ClientKafka.prototype.getReplyTopicPartition = function (topic) {
        var minimumPartition = this.consumerAssignments[topic];
        if ((0, shared_utils_1.isUndefined)(minimumPartition)) {
            throw new invalid_kafka_client_topic_exception_1.InvalidKafkaClientTopicException(topic);
        }
        // get the minimum partition
        return minimumPartition.toString();
    };
    ClientKafka.prototype.publish = function (partialPacket, callback) {
        var _this = this;
        var packet = this.assignPacketId(partialPacket);
        this.routingMap.set(packet.id, callback);
        var cleanup = function () { return _this.routingMap["delete"](packet.id); };
        var errorCallback = function (err) {
            cleanup();
            callback({ err: err });
        };
        try {
            var pattern_1 = this.normalizePattern(partialPacket.pattern);
            var replyTopic_1 = this.getResponsePatternName(pattern_1);
            var replyPartition_1 = this.getReplyTopicPartition(replyTopic_1);
            Promise.resolve(this.serializer.serialize(packet.data, { pattern: pattern_1 }))
                .then(function (serializedPacket) {
                serializedPacket.headers[enums_1.KafkaHeaders.CORRELATION_ID] = packet.id;
                serializedPacket.headers[enums_1.KafkaHeaders.REPLY_TOPIC] = replyTopic_1;
                serializedPacket.headers[enums_1.KafkaHeaders.REPLY_PARTITION] =
                    replyPartition_1;
                var message = Object.assign({
                    topic: pattern_1,
                    messages: [serializedPacket]
                }, _this.options.send || {});
                return _this.producer.send(message);
            })["catch"](function (err) { return errorCallback(err); });
            return cleanup;
        }
        catch (err) {
            errorCallback(err);
        }
    };
    ClientKafka.prototype.getResponsePatternName = function (pattern) {
        return "".concat(pattern, ".reply");
    };
    ClientKafka.prototype.setConsumerAssignments = function (data) {
        var consumerAssignments = {};
        // only need to set the minimum
        Object.keys(data.payload.memberAssignment).forEach(function (topic) {
            var memberPartitions = data.payload.memberAssignment[topic];
            if (memberPartitions.length) {
                consumerAssignments[topic] = Math.min.apply(Math, memberPartitions);
            }
        });
        this.consumerAssignments = consumerAssignments;
    };
    ClientKafka.prototype.initializeSerializer = function (options) {
        this.serializer =
            (options && options.serializer) || new kafka_request_serializer_1.KafkaRequestSerializer();
    };
    ClientKafka.prototype.initializeDeserializer = function (options) {
        this.deserializer =
            (options && options.deserializer) || new kafka_response_deserializer_1.KafkaResponseDeserializer();
    };
    ClientKafka.prototype.commitOffsets = function (topicPartitions) {
        if (this.consumer) {
            return this.consumer.commitOffsets(topicPartitions);
        }
        else {
            throw new Error('No consumer initialized');
        }
    };
    return ClientKafka;
}(client_proxy_1.ClientProxy));
exports.ClientKafka = ClientKafka;
