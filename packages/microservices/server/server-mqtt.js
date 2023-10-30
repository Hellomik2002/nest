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
exports.ServerMqtt = void 0;
var shared_utils_1 = require("@nestjs/common/utils/shared.utils");
var constants_1 = require("../constants");
var mqtt_context_1 = require("../ctx-host/mqtt.context");
var enums_1 = require("../enums");
var mqtt_record_serializer_1 = require("../serializers/mqtt-record.serializer");
var server_1 = require("./server");
var mqttPackage = {};
var ServerMqtt = /** @class */ (function (_super) {
    __extends(ServerMqtt, _super);
    function ServerMqtt(options) {
        var _this = _super.call(this) || this;
        _this.options = options;
        _this.transportId = enums_1.Transport.MQTT;
        _this.url = _this.getOptionsProp(options, 'url') || constants_1.MQTT_DEFAULT_URL;
        mqttPackage = _this.loadPackage('mqtt', ServerMqtt.name, function () {
            return require('mqtt');
        });
        _this.initializeSerializer(options);
        _this.initializeDeserializer(options);
        return _this;
    }
    ServerMqtt.prototype.listen = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    this.mqttClient = this.createMqttClient();
                    this.start(callback);
                }
                catch (err) {
                    callback(err);
                }
                return [2 /*return*/];
            });
        });
    };
    ServerMqtt.prototype.start = function (callback) {
        this.handleError(this.mqttClient);
        this.bindEvents(this.mqttClient);
        this.mqttClient.on(constants_1.CONNECT_EVENT, function () { return callback(); });
    };
    ServerMqtt.prototype.bindEvents = function (mqttClient) {
        var _this = this;
        mqttClient.on(constants_1.MESSAGE_EVENT, this.getMessageHandler(mqttClient).bind(this));
        var registeredPatterns = __spreadArray([], this.messageHandlers.keys(), true);
        registeredPatterns.forEach(function (pattern) {
            var isEventHandler = _this.messageHandlers.get(pattern).isEventHandler;
            mqttClient.subscribe(isEventHandler ? pattern : _this.getRequestPattern(pattern), _this.getOptionsProp(_this.options, 'subscribeOptions'));
        });
    };
    ServerMqtt.prototype.close = function () {
        this.mqttClient && this.mqttClient.end();
    };
    ServerMqtt.prototype.createMqttClient = function () {
        return mqttPackage.connect(this.url, this.options);
    };
    ServerMqtt.prototype.getMessageHandler = function (pub) {
        var _this = this;
        return function (channel, buffer, originalPacket) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, this.handleMessage(channel, buffer, pub, originalPacket)];
        }); }); };
    };
    ServerMqtt.prototype.handleMessage = function (channel, buffer, pub, originalPacket) {
        return __awaiter(this, void 0, void 0, function () {
            var rawPacket, packet, mqttContext, publish, handler, status_1, noHandlerPacket, response$, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        rawPacket = this.parseMessage(buffer.toString());
                        return [4 /*yield*/, this.deserializer.deserialize(rawPacket, { channel: channel })];
                    case 1:
                        packet = _b.sent();
                        mqttContext = new mqtt_context_1.MqttContext([channel, originalPacket]);
                        if ((0, shared_utils_1.isUndefined)(packet.id)) {
                            return [2 /*return*/, this.handleEvent(channel, packet, mqttContext)];
                        }
                        publish = this.getPublisher(pub, channel, packet.id);
                        handler = this.getHandlerByPattern(channel);
                        if (!handler) {
                            status_1 = 'error';
                            noHandlerPacket = {
                                id: packet.id,
                                status: status_1,
                                err: constants_1.NO_MESSAGE_HANDLER
                            };
                            return [2 /*return*/, publish(noHandlerPacket)];
                        }
                        _a = this.transformToObservable;
                        return [4 /*yield*/, handler(packet.data, mqttContext)];
                    case 2:
                        response$ = _a.apply(this, [_b.sent()]);
                        response$ && this.send(response$, publish);
                        return [2 /*return*/];
                }
            });
        });
    };
    ServerMqtt.prototype.getPublisher = function (client, pattern, id) {
        var _this = this;
        return function (response) {
            Object.assign(response, { id: id });
            var outgoingResponse = _this.serializer.serialize(response);
            var options = outgoingResponse.options;
            delete outgoingResponse.options;
            return client.publish(_this.getReplyPattern(pattern), JSON.stringify(outgoingResponse), options);
        };
    };
    ServerMqtt.prototype.parseMessage = function (content) {
        try {
            return JSON.parse(content);
        }
        catch (e) {
            return content;
        }
    };
    ServerMqtt.prototype.matchMqttPattern = function (pattern, topic) {
        var patternSegments = pattern.split(constants_1.MQTT_SEPARATOR);
        var topicSegments = topic.split(constants_1.MQTT_SEPARATOR);
        var patternSegmentsLength = patternSegments.length;
        var topicSegmentsLength = topicSegments.length;
        var lastIndex = patternSegmentsLength - 1;
        for (var i = 0; i < patternSegmentsLength; i++) {
            var currentPattern = patternSegments[i];
            var patternChar = currentPattern[0];
            var currentTopic = topicSegments[i];
            if (!currentTopic && !currentPattern) {
                continue;
            }
            if (!currentTopic && currentPattern !== constants_1.MQTT_WILDCARD_ALL) {
                return false;
            }
            if (patternChar === constants_1.MQTT_WILDCARD_ALL) {
                return i === lastIndex;
            }
            if (patternChar !== constants_1.MQTT_WILDCARD_SINGLE &&
                currentPattern !== currentTopic) {
                return false;
            }
        }
        return patternSegmentsLength === topicSegmentsLength;
    };
    ServerMqtt.prototype.getHandlerByPattern = function (pattern) {
        var route = this.getRouteFromPattern(pattern);
        if (this.messageHandlers.has(route)) {
            return this.messageHandlers.get(route) || null;
        }
        for (var _i = 0, _a = this.messageHandlers; _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            var keyWithoutSharedPrefix = this.removeHandlerKeySharedPrefix(key);
            if (this.matchMqttPattern(keyWithoutSharedPrefix, route)) {
                return value;
            }
        }
        return null;
    };
    ServerMqtt.prototype.removeHandlerKeySharedPrefix = function (handlerKey) {
        return handlerKey && handlerKey.startsWith('$share')
            ? handlerKey.split('/').slice(2).join('/')
            : handlerKey;
    };
    ServerMqtt.prototype.getRequestPattern = function (pattern) {
        return pattern;
    };
    ServerMqtt.prototype.getReplyPattern = function (pattern) {
        return "".concat(pattern, "/reply");
    };
    ServerMqtt.prototype.handleError = function (stream) {
        var _this = this;
        stream.on(constants_1.ERROR_EVENT, function (err) { return _this.logger.error(err); });
    };
    ServerMqtt.prototype.initializeSerializer = function (options) {
        var _a;
        this.serializer = (_a = options === null || options === void 0 ? void 0 : options.serializer) !== null && _a !== void 0 ? _a : new mqtt_record_serializer_1.MqttRecordSerializer();
    };
    return ServerMqtt;
}(server_1.Server));
exports.ServerMqtt = ServerMqtt;
