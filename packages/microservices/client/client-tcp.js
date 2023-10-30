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
exports.ClientTCP = void 0;
var common_1 = require("@nestjs/common");
var net = require("net");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var constants_1 = require("../constants");
var helpers_1 = require("../helpers");
var tls_1 = require("tls");
var client_proxy_1 = require("./client-proxy");
/**
 * @publicApi
 */
var ClientTCP = /** @class */ (function (_super) {
    __extends(ClientTCP, _super);
    function ClientTCP(options) {
        var _this = _super.call(this) || this;
        _this.logger = new common_1.Logger(ClientTCP.name);
        _this.isConnected = false;
        _this.port = _this.getOptionsProp(options, 'port') || constants_1.TCP_DEFAULT_PORT;
        _this.host = _this.getOptionsProp(options, 'host') || constants_1.TCP_DEFAULT_HOST;
        _this.socketClass =
            _this.getOptionsProp(options, 'socketClass') || helpers_1.JsonSocket;
        _this.tlsOptions = _this.getOptionsProp(options, 'tlsOptions');
        _this.initializeSerializer(options);
        _this.initializeDeserializer(options);
        return _this;
    }
    ClientTCP.prototype.connect = function () {
        var _this = this;
        if (this.connection) {
            return this.connection;
        }
        this.socket = this.createSocket();
        this.bindEvents(this.socket);
        var source$ = this.connect$(this.socket.netSocket).pipe((0, operators_1.tap)(function () {
            _this.isConnected = true;
            _this.socket.on(constants_1.MESSAGE_EVENT, function (buffer) {
                return _this.handleResponse(buffer);
            });
        }), (0, operators_1.share)());
        // For TLS connections, the connection is initiated when the socket is created
        if (!this.tlsOptions) {
            this.socket.connect(this.port, this.host);
        }
        this.connection = (0, rxjs_1.lastValueFrom)(source$)["catch"](function (err) {
            if (err instanceof rxjs_1.EmptyError) {
                return;
            }
            throw err;
        });
        return this.connection;
    };
    ClientTCP.prototype.handleResponse = function (buffer) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, err, response, isDisposed, id, callback;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.deserializer.deserialize(buffer)];
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
        });
    };
    ClientTCP.prototype.createSocket = function () {
        var socket;
        /**
         * TLS enabled, "upgrade" the TCP Socket to TLS
         */
        if (this.tlsOptions) {
            socket = (0, tls_1.connect)(__assign(__assign({}, this.tlsOptions), { port: this.port, host: this.host, socket: socket }));
        }
        else {
            socket = new net.Socket();
        }
        return new this.socketClass(socket);
    };
    ClientTCP.prototype.close = function () {
        this.socket && this.socket.end();
        this.handleClose();
    };
    ClientTCP.prototype.bindEvents = function (socket) {
        var _this = this;
        socket.on(constants_1.ERROR_EVENT, function (err) { return err.code !== constants_1.ECONNREFUSED && _this.handleError(err); });
        socket.on(constants_1.CLOSE_EVENT, function () { return _this.handleClose(); });
    };
    ClientTCP.prototype.handleError = function (err) {
        this.logger.error(err);
    };
    ClientTCP.prototype.handleClose = function () {
        this.isConnected = false;
        this.socket = null;
        this.connection = undefined;
        if (this.routingMap.size > 0) {
            var err = new Error('Connection closed');
            for (var _i = 0, _a = this.routingMap.values(); _i < _a.length; _i++) {
                var callback = _a[_i];
                callback({ err: err });
            }
            this.routingMap.clear();
        }
    };
    ClientTCP.prototype.publish = function (partialPacket, callback) {
        var _this = this;
        try {
            var packet_1 = this.assignPacketId(partialPacket);
            var serializedPacket = this.serializer.serialize(packet_1);
            this.routingMap.set(packet_1.id, callback);
            this.socket.sendMessage(serializedPacket);
            return function () { return _this.routingMap["delete"](packet_1.id); };
        }
        catch (err) {
            callback({ err: err });
        }
    };
    ClientTCP.prototype.dispatchEvent = function (packet) {
        return __awaiter(this, void 0, void 0, function () {
            var pattern, serializedPacket;
            return __generator(this, function (_a) {
                pattern = this.normalizePattern(packet.pattern);
                serializedPacket = this.serializer.serialize(__assign(__assign({}, packet), { pattern: pattern }));
                return [2 /*return*/, this.socket.sendMessage(serializedPacket)];
            });
        });
    };
    return ClientTCP;
}(client_proxy_1.ClientProxy));
exports.ClientTCP = ClientTCP;
