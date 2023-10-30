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
exports.__esModule = true;
exports.ServerTCP = void 0;
var shared_utils_1 = require("@nestjs/common/utils/shared.utils");
var net = require("net");
var constants_1 = require("../constants");
var tcp_context_1 = require("../ctx-host/tcp.context");
var enums_1 = require("../enums");
var helpers_1 = require("../helpers");
var tls_1 = require("tls");
var server_1 = require("./server");
var ServerTCP = /** @class */ (function (_super) {
    __extends(ServerTCP, _super);
    function ServerTCP(options) {
        var _this = _super.call(this) || this;
        _this.options = options;
        _this.transportId = enums_1.Transport.TCP;
        _this.isExplicitlyTerminated = false;
        _this.retryAttemptsCount = 0;
        _this.port = _this.getOptionsProp(options, 'port') || constants_1.TCP_DEFAULT_PORT;
        _this.host = _this.getOptionsProp(options, 'host') || constants_1.TCP_DEFAULT_HOST;
        _this.socketClass =
            _this.getOptionsProp(options, 'socketClass') || helpers_1.JsonSocket;
        _this.tlsOptions = _this.getOptionsProp(options, 'tlsOptions');
        _this.init();
        _this.initializeSerializer(options);
        _this.initializeDeserializer(options);
        return _this;
    }
    ServerTCP.prototype.listen = function (callback) {
        this.server.once(constants_1.ERROR_EVENT, function (err) {
            if ((err === null || err === void 0 ? void 0 : err.code) === constants_1.EADDRINUSE || (err === null || err === void 0 ? void 0 : err.code) === constants_1.ECONNREFUSED) {
                return callback(err);
            }
        });
        this.server.listen(this.port, this.host, callback);
    };
    ServerTCP.prototype.close = function () {
        this.isExplicitlyTerminated = true;
        this.server.close();
    };
    ServerTCP.prototype.bindHandler = function (socket) {
        var _this = this;
        var readSocket = this.getSocketInstance(socket);
        readSocket.on(constants_1.MESSAGE_EVENT, function (msg) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, this.handleMessage(readSocket, msg)];
        }); }); });
        readSocket.on(constants_1.ERROR_EVENT, this.handleError.bind(this));
    };
    ServerTCP.prototype.handleMessage = function (socket, rawMessage) {
        return __awaiter(this, void 0, void 0, function () {
            var packet, pattern, tcpContext, handler, status_1, noHandlerPacket, response$, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.deserializer.deserialize(rawMessage)];
                    case 1:
                        packet = _b.sent();
                        pattern = !(0, shared_utils_1.isString)(packet.pattern)
                            ? JSON.stringify(packet.pattern)
                            : packet.pattern;
                        tcpContext = new tcp_context_1.TcpContext([socket, pattern]);
                        if ((0, shared_utils_1.isUndefined)(packet.id)) {
                            return [2 /*return*/, this.handleEvent(pattern, packet, tcpContext)];
                        }
                        handler = this.getHandlerByPattern(pattern);
                        if (!handler) {
                            status_1 = 'error';
                            noHandlerPacket = this.serializer.serialize({
                                id: packet.id,
                                status: status_1,
                                err: constants_1.NO_MESSAGE_HANDLER
                            });
                            return [2 /*return*/, socket.sendMessage(noHandlerPacket)];
                        }
                        _a = this.transformToObservable;
                        return [4 /*yield*/, handler(packet.data, tcpContext)];
                    case 2:
                        response$ = _a.apply(this, [_b.sent()]);
                        response$ &&
                            this.send(response$, function (data) {
                                Object.assign(data, { id: packet.id });
                                var outgoingResponse = _this.serializer.serialize(data);
                                socket.sendMessage(outgoingResponse);
                            });
                        return [2 /*return*/];
                }
            });
        });
    };
    ServerTCP.prototype.handleClose = function () {
        var _this = this;
        if (this.isExplicitlyTerminated ||
            !this.getOptionsProp(this.options, 'retryAttempts') ||
            this.retryAttemptsCount >=
                this.getOptionsProp(this.options, 'retryAttempts')) {
            return undefined;
        }
        ++this.retryAttemptsCount;
        return setTimeout(function () { return _this.server.listen(_this.port, _this.host); }, this.getOptionsProp(this.options, 'retryDelay') || 0);
    };
    ServerTCP.prototype.init = function () {
        if (this.tlsOptions) {
            // TLS enabled, use tls server
            this.server = (0, tls_1.createServer)(this.tlsOptions, this.bindHandler.bind(this));
        }
        else {
            // TLS disabled, use net server
            this.server = net.createServer(this.bindHandler.bind(this));
        }
        this.server.on(constants_1.ERROR_EVENT, this.handleError.bind(this));
        this.server.on(constants_1.CLOSE_EVENT, this.handleClose.bind(this));
    };
    ServerTCP.prototype.getSocketInstance = function (socket) {
        return new this.socketClass(socket);
    };
    return ServerTCP;
}(server_1.Server));
exports.ServerTCP = ServerTCP;
