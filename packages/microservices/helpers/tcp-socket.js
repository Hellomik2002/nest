"use strict";
exports.__esModule = true;
exports.TcpSocket = void 0;
var constants_1 = require("../constants");
var net_socket_closed_exception_1 = require("../errors/net-socket-closed.exception");
var invalid_json_format_exception_1 = require("../errors/invalid-json-format.exception");
var TcpSocket = /** @class */ (function () {
    function TcpSocket(socket) {
        var _this = this;
        this.socket = socket;
        this.isClosed = false;
        this.socket.on(constants_1.DATA_EVENT, this.onData.bind(this));
        this.socket.on(constants_1.CONNECT_EVENT, function () { return (_this.isClosed = false); });
        this.socket.on(constants_1.CLOSE_EVENT, function () { return (_this.isClosed = true); });
        this.socket.on(constants_1.ERROR_EVENT, function () { return (_this.isClosed = true); });
    }
    Object.defineProperty(TcpSocket.prototype, "netSocket", {
        get: function () {
            return this.socket;
        },
        enumerable: false,
        configurable: true
    });
    TcpSocket.prototype.connect = function (port, host) {
        this.socket.connect(port, host);
        return this;
    };
    TcpSocket.prototype.on = function (event, callback) {
        this.socket.on(event, callback);
        return this;
    };
    TcpSocket.prototype.once = function (event, callback) {
        this.socket.once(event, callback);
        return this;
    };
    TcpSocket.prototype.end = function () {
        this.socket.end();
        return this;
    };
    TcpSocket.prototype.sendMessage = function (message, callback) {
        if (this.isClosed) {
            callback && callback(new net_socket_closed_exception_1.NetSocketClosedException());
            return;
        }
        this.handleSend(message, callback);
    };
    TcpSocket.prototype.onData = function (data) {
        try {
            this.handleData(data);
        }
        catch (e) {
            this.socket.emit(constants_1.ERROR_EVENT, e.message);
            this.socket.end();
        }
    };
    TcpSocket.prototype.emitMessage = function (data) {
        var message;
        try {
            message = JSON.parse(data);
        }
        catch (e) {
            throw new invalid_json_format_exception_1.InvalidJSONFormatException(e, data);
        }
        message = message || {};
        this.socket.emit(constants_1.MESSAGE_EVENT, message);
    };
    return TcpSocket;
}());
exports.TcpSocket = TcpSocket;
