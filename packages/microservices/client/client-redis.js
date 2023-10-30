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
exports.ClientRedis = void 0;
var logger_service_1 = require("@nestjs/common/services/logger.service");
var load_package_util_1 = require("@nestjs/common/utils/load-package.util");
var constants_1 = require("../constants");
var client_proxy_1 = require("./client-proxy");
var redisPackage = {};
/**
 * @publicApi
 */
var ClientRedis = /** @class */ (function (_super) {
    __extends(ClientRedis, _super);
    function ClientRedis(options) {
        var _this = _super.call(this) || this;
        _this.options = options;
        _this.logger = new logger_service_1.Logger(client_proxy_1.ClientProxy.name);
        _this.subscriptionsCount = new Map();
        _this.isExplicitlyTerminated = false;
        redisPackage = (0, load_package_util_1.loadPackage)('ioredis', ClientRedis.name, function () {
            return require('ioredis');
        });
        _this.initializeSerializer(options);
        _this.initializeDeserializer(options);
        return _this;
    }
    ClientRedis.prototype.getRequestPattern = function (pattern) {
        return pattern;
    };
    ClientRedis.prototype.getReplyPattern = function (pattern) {
        return "".concat(pattern, ".reply");
    };
    ClientRedis.prototype.close = function () {
        this.pubClient && this.pubClient.quit();
        this.subClient && this.subClient.quit();
        this.pubClient = this.subClient = null;
        this.isExplicitlyTerminated = true;
    };
    ClientRedis.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.pubClient && this.subClient) {
                            return [2 /*return*/, this.connection];
                        }
                        this.pubClient = this.createClient();
                        this.subClient = this.createClient();
                        this.handleError(this.pubClient);
                        this.handleError(this.subClient);
                        this.connection = Promise.all([
                            this.subClient.connect(),
                            this.pubClient.connect(),
                        ]);
                        return [4 /*yield*/, this.connection];
                    case 1:
                        _a.sent();
                        this.subClient.on(constants_1.MESSAGE_EVENT, this.createResponseCallback());
                        return [2 /*return*/, this.connection];
                }
            });
        });
    };
    ClientRedis.prototype.createClient = function () {
        return new redisPackage(__assign(__assign({ host: constants_1.REDIS_DEFAULT_HOST, port: constants_1.REDIS_DEFAULT_PORT }, this.getClientOptions()), { lazyConnect: true }));
    };
    ClientRedis.prototype.handleError = function (client) {
        var _this = this;
        client.addListener(constants_1.ERROR_EVENT, function (err) { return _this.logger.error(err); });
    };
    ClientRedis.prototype.getClientOptions = function () {
        var _this = this;
        var retryStrategy = function (times) { return _this.createRetryStrategy(times); };
        return __assign(__assign({}, (this.options || {})), { retryStrategy: retryStrategy });
    };
    ClientRedis.prototype.createRetryStrategy = function (times) {
        if (this.isExplicitlyTerminated) {
            return undefined;
        }
        if (!this.getOptionsProp(this.options, 'retryAttempts') ||
            times > this.getOptionsProp(this.options, 'retryAttempts')) {
            this.logger.error('Retry time exhausted');
            return;
        }
        return this.getOptionsProp(this.options, 'retryDelay') || 0;
    };
    ClientRedis.prototype.createResponseCallback = function () {
        var _this = this;
        return function (channel, buffer) { return __awaiter(_this, void 0, void 0, function () {
            var packet, _a, err, response, isDisposed, id, callback;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        packet = JSON.parse(buffer);
                        return [4 /*yield*/, this.deserializer.deserialize(packet)];
                    case 1:
                        _a = _b.sent(), err = _a.err, response = _a.response, isDisposed = _a.isDisposed, id = _a.id;
                        callback = this.routingMap.get(id);
                        if (!callback) {
                            return [2 /*return*/];
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
    ClientRedis.prototype.publish = function (partialPacket, callback) {
        var _this = this;
        try {
            var packet_1 = this.assignPacketId(partialPacket);
            var pattern_1 = this.normalizePattern(partialPacket.pattern);
            var serializedPacket_1 = this.serializer.serialize(packet_1);
            var responseChannel_1 = this.getReplyPattern(pattern_1);
            var subscriptionsCount_1 = this.subscriptionsCount.get(responseChannel_1) || 0;
            var publishPacket_1 = function () {
                subscriptionsCount_1 = _this.subscriptionsCount.get(responseChannel_1) || 0;
                _this.subscriptionsCount.set(responseChannel_1, subscriptionsCount_1 + 1);
                _this.routingMap.set(packet_1.id, callback);
                _this.pubClient.publish(_this.getRequestPattern(pattern_1), JSON.stringify(serializedPacket_1));
            };
            if (subscriptionsCount_1 <= 0) {
                this.subClient.subscribe(responseChannel_1, function (err) { return !err && publishPacket_1(); });
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
    ClientRedis.prototype.dispatchEvent = function (packet) {
        var _this = this;
        var pattern = this.normalizePattern(packet.pattern);
        var serializedPacket = this.serializer.serialize(packet);
        return new Promise(function (resolve, reject) {
            return _this.pubClient.publish(pattern, JSON.stringify(serializedPacket), function (err) {
                return err ? reject(err) : resolve();
            });
        });
    };
    ClientRedis.prototype.unsubscribeFromChannel = function (channel) {
        var subscriptionCount = this.subscriptionsCount.get(channel);
        this.subscriptionsCount.set(channel, subscriptionCount - 1);
        if (subscriptionCount - 1 <= 0) {
            this.subClient.unsubscribe(channel);
        }
    };
    return ClientRedis;
}(client_proxy_1.ClientProxy));
exports.ClientRedis = ClientRedis;
