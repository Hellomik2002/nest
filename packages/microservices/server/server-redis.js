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
exports.ServerRedis = void 0;
var shared_utils_1 = require("@nestjs/common/utils/shared.utils");
var constants_1 = require("../constants");
var ctx_host_1 = require("../ctx-host");
var enums_1 = require("../enums");
var server_1 = require("./server");
var redisPackage = {};
var ServerRedis = /** @class */ (function (_super) {
    __extends(ServerRedis, _super);
    function ServerRedis(options) {
        var _this = _super.call(this) || this;
        _this.options = options;
        _this.transportId = enums_1.Transport.REDIS;
        _this.isExplicitlyTerminated = false;
        redisPackage = _this.loadPackage('ioredis', ServerRedis.name, function () {
            return require('ioredis');
        });
        _this.initializeSerializer(options);
        _this.initializeDeserializer(options);
        return _this;
    }
    ServerRedis.prototype.listen = function (callback) {
        try {
            this.subClient = this.createRedisClient();
            this.pubClient = this.createRedisClient();
            this.handleError(this.pubClient);
            this.handleError(this.subClient);
            this.start(callback);
        }
        catch (err) {
            callback(err);
        }
    };
    ServerRedis.prototype.start = function (callback) {
        var _this = this;
        Promise.all([this.subClient.connect(), this.pubClient.connect()])
            .then(function () {
            _this.bindEvents(_this.subClient, _this.pubClient);
            callback();
        })["catch"](callback);
    };
    ServerRedis.prototype.bindEvents = function (subClient, pubClient) {
        var _this = this;
        var _a;
        subClient.on(((_a = this.options) === null || _a === void 0 ? void 0 : _a.wildcards) ? 'pmessage' : constants_1.MESSAGE_EVENT, this.getMessageHandler(pubClient).bind(this));
        var subscribePatterns = __spreadArray([], this.messageHandlers.keys(), true);
        subscribePatterns.forEach(function (pattern) {
            var _a;
            var isEventHandler = _this.messageHandlers.get(pattern).isEventHandler;
            var channel = isEventHandler
                ? pattern
                : _this.getRequestPattern(pattern);
            if ((_a = _this.options) === null || _a === void 0 ? void 0 : _a.wildcards) {
                subClient.psubscribe(channel);
            }
            else {
                subClient.subscribe(channel);
            }
        });
    };
    ServerRedis.prototype.close = function () {
        this.isExplicitlyTerminated = true;
        this.pubClient && this.pubClient.quit();
        this.subClient && this.subClient.quit();
    };
    ServerRedis.prototype.createRedisClient = function () {
        return new redisPackage(__assign(__assign({ port: constants_1.REDIS_DEFAULT_PORT, host: constants_1.REDIS_DEFAULT_HOST }, this.getClientOptions()), { lazyConnect: true }));
    };
    ServerRedis.prototype.getMessageHandler = function (pub) {
        var _this = this;
        var _a;
        return ((_a = this.options) === null || _a === void 0 ? void 0 : _a.wildcards)
            ? function (channel, pattern, buffer) {
                return _this.handleMessage(channel, buffer, pub, pattern);
            }
            : function (channel, buffer) {
                return _this.handleMessage(channel, buffer, pub, channel);
            };
    };
    ServerRedis.prototype.handleMessage = function (channel, buffer, pub, pattern) {
        return __awaiter(this, void 0, void 0, function () {
            var rawMessage, packet, redisCtx, publish, handler, status_1, noHandlerPacket, response$, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        rawMessage = this.parseMessage(buffer);
                        return [4 /*yield*/, this.deserializer.deserialize(rawMessage, { channel: channel })];
                    case 1:
                        packet = _b.sent();
                        redisCtx = new ctx_host_1.RedisContext([pattern]);
                        if ((0, shared_utils_1.isUndefined)(packet.id)) {
                            return [2 /*return*/, this.handleEvent(channel, packet, redisCtx)];
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
                        return [4 /*yield*/, handler(packet.data, redisCtx)];
                    case 2:
                        response$ = _a.apply(this, [_b.sent()]);
                        response$ && this.send(response$, publish);
                        return [2 /*return*/];
                }
            });
        });
    };
    ServerRedis.prototype.getPublisher = function (pub, pattern, id) {
        var _this = this;
        return function (response) {
            Object.assign(response, { id: id });
            var outgoingResponse = _this.serializer.serialize(response);
            return pub.publish(_this.getReplyPattern(pattern), JSON.stringify(outgoingResponse));
        };
    };
    ServerRedis.prototype.parseMessage = function (content) {
        try {
            return JSON.parse(content);
        }
        catch (e) {
            return content;
        }
    };
    ServerRedis.prototype.getRequestPattern = function (pattern) {
        return pattern;
    };
    ServerRedis.prototype.getReplyPattern = function (pattern) {
        return "".concat(pattern, ".reply");
    };
    ServerRedis.prototype.handleError = function (stream) {
        var _this = this;
        stream.on(constants_1.ERROR_EVENT, function (err) { return _this.logger.error(err); });
    };
    ServerRedis.prototype.getClientOptions = function () {
        var _this = this;
        var retryStrategy = function (times) { return _this.createRetryStrategy(times); };
        return __assign(__assign({}, (this.options || {})), { retryStrategy: retryStrategy });
    };
    ServerRedis.prototype.createRetryStrategy = function (times) {
        if (this.isExplicitlyTerminated) {
            return undefined;
        }
        if (!this.getOptionsProp(this.options, 'retryAttempts') ||
            times > this.getOptionsProp(this.options, 'retryAttempts')) {
            this.logger.error("Retry time exhausted");
            return;
        }
        return this.getOptionsProp(this.options, 'retryDelay') || 0;
    };
    return ServerRedis;
}(server_1.Server));
exports.ServerRedis = ServerRedis;
