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
exports.ClientMqtt = void 0;
var logger_service_1 = require("@nestjs/common/services/logger.service");
var load_package_util_1 = require("@nestjs/common/utils/load-package.util");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var constants_1 = require("../constants");
var mqtt_record_serializer_1 = require("../serializers/mqtt-record.serializer");
var client_proxy_1 = require("./client-proxy");
var mqttPackage = {};
/**
 * @publicApi
 */
var ClientMqtt = /** @class */ (function (_super) {
    __extends(ClientMqtt, _super);
    function ClientMqtt(options) {
        var _this = _super.call(this) || this;
        _this.options = options;
        _this.logger = new logger_service_1.Logger(client_proxy_1.ClientProxy.name);
        _this.subscriptionsCount = new Map();
        _this.url = _this.getOptionsProp(_this.options, 'url') || constants_1.MQTT_DEFAULT_URL;
        mqttPackage = (0, load_package_util_1.loadPackage)('mqtt', ClientMqtt.name, function () { return require('mqtt'); });
        _this.initializeSerializer(options);
        _this.initializeDeserializer(options);
        return _this;
    }
    ClientMqtt.prototype.getRequestPattern = function (pattern) {
        return pattern;
    };
    ClientMqtt.prototype.getResponsePattern = function (pattern) {
        return "".concat(pattern, "/reply");
    };
    ClientMqtt.prototype.close = function () {
        this.mqttClient && this.mqttClient.end();
        this.mqttClient = null;
        this.connection = null;
    };
    ClientMqtt.prototype.connect = function () {
        var _this = this;
        if (this.mqttClient) {
            return this.connection;
        }
        this.mqttClient = this.createClient();
        this.handleError(this.mqttClient);
        var connect$ = this.connect$(this.mqttClient);
        this.connection = (0, rxjs_1.lastValueFrom)(this.mergeCloseEvent(this.mqttClient, connect$).pipe((0, operators_1.tap)(function () {
            return _this.mqttClient.on(constants_1.MESSAGE_EVENT, _this.createResponseCallback());
        }), (0, operators_1.share)()))["catch"](function (err) {
            if (err instanceof rxjs_1.EmptyError) {
                return;
            }
            throw err;
        });
        return this.connection;
    };
    ClientMqtt.prototype.mergeCloseEvent = function (instance, source$) {
        var close$ = (0, rxjs_1.fromEvent)(instance, constants_1.CLOSE_EVENT).pipe((0, operators_1.map)(function (err) {
            throw err;
        }));
        return (0, rxjs_1.merge)(source$, close$).pipe((0, operators_1.first)());
    };
    ClientMqtt.prototype.createClient = function () {
        return mqttPackage.connect(this.url, this.options);
    };
    ClientMqtt.prototype.handleError = function (client) {
        var _this = this;
        client.addListener(constants_1.ERROR_EVENT, function (err) { return err.code !== constants_1.ECONNREFUSED && _this.logger.error(err); });
    };
    ClientMqtt.prototype.createResponseCallback = function () {
        var _this = this;
        return function (channel, buffer) { return __awaiter(_this, void 0, void 0, function () {
            var packet, _a, err, response, isDisposed, id, callback;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        packet = JSON.parse(buffer.toString());
                        return [4 /*yield*/, this.deserializer.deserialize(packet)];
                    case 1:
                        _a = _b.sent(), err = _a.err, response = _a.response, isDisposed = _a.isDisposed, id = _a.id;
                        callback = this.routingMap.get(id);
                        if (!callback) {
                            return [2 /*return*/, undefined];
                        }
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
    ClientMqtt.prototype.publish = function (partialPacket, callback) {
        var _this = this;
        try {
            var packet_1 = this.assignPacketId(partialPacket);
            var pattern_1 = this.normalizePattern(partialPacket.pattern);
            var serializedPacket_1 = this.serializer.serialize(packet_1);
            var responseChannel_1 = this.getResponsePattern(pattern_1);
            var subscriptionsCount_1 = this.subscriptionsCount.get(responseChannel_1) || 0;
            var publishPacket_1 = function () {
                subscriptionsCount_1 = _this.subscriptionsCount.get(responseChannel_1) || 0;
                _this.subscriptionsCount.set(responseChannel_1, subscriptionsCount_1 + 1);
                _this.routingMap.set(packet_1.id, callback);
                var options = serializedPacket_1.options;
                delete serializedPacket_1.options;
                _this.mqttClient.publish(_this.getRequestPattern(pattern_1), JSON.stringify(serializedPacket_1), _this.mergePacketOptions(options));
            };
            if (subscriptionsCount_1 <= 0) {
                this.mqttClient.subscribe(responseChannel_1, function (err) { return !err && publishPacket_1(); });
            }
            else {
                publishPacket_1();
            }
            return function () {
                _this.unsubscribeFromChannel(responseChannel_1);
                _this.routingMap["delete"](packet_1.id);
            };
        }
        catch (err) {
            callback({ err: err });
        }
    };
    ClientMqtt.prototype.dispatchEvent = function (packet) {
        var _this = this;
        var pattern = this.normalizePattern(packet.pattern);
        var serializedPacket = this.serializer.serialize(packet);
        var options = serializedPacket.options;
        delete serializedPacket.options;
        return new Promise(function (resolve, reject) {
            return _this.mqttClient.publish(pattern, JSON.stringify(serializedPacket), _this.mergePacketOptions(options), function (err) { return (err ? reject(err) : resolve()); });
        });
    };
    ClientMqtt.prototype.unsubscribeFromChannel = function (channel) {
        var subscriptionCount = this.subscriptionsCount.get(channel);
        this.subscriptionsCount.set(channel, subscriptionCount - 1);
        if (subscriptionCount - 1 <= 0) {
            this.mqttClient.unsubscribe(channel);
        }
    };
    ClientMqtt.prototype.initializeSerializer = function (options) {
        var _a;
        this.serializer = (_a = options === null || options === void 0 ? void 0 : options.serializer) !== null && _a !== void 0 ? _a : new mqtt_record_serializer_1.MqttRecordSerializer();
    };
    ClientMqtt.prototype.mergePacketOptions = function (requestOptions) {
        var _a, _b, _c;
        if (!requestOptions && !((_a = this.options) === null || _a === void 0 ? void 0 : _a.userProperties)) {
            return undefined;
        }
        return __assign(__assign({}, requestOptions), { properties: __assign(__assign({}, requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.properties), { userProperties: __assign(__assign({}, (_b = this.options) === null || _b === void 0 ? void 0 : _b.userProperties), (_c = requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.properties) === null || _c === void 0 ? void 0 : _c.userProperties) }) });
    };
    return ClientMqtt;
}(client_proxy_1.ClientProxy));
exports.ClientMqtt = ClientMqtt;
