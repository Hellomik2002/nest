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
exports.__esModule = true;
exports.JsonSocket = void 0;
var buffer_1 = require("buffer");
var string_decoder_1 = require("string_decoder");
var corrupted_packet_length_exception_1 = require("../errors/corrupted-packet-length.exception");
var tcp_socket_1 = require("./tcp-socket");
var JsonSocket = /** @class */ (function (_super) {
    __extends(JsonSocket, _super);
    function JsonSocket() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.contentLength = null;
        _this.buffer = '';
        _this.stringDecoder = new string_decoder_1.StringDecoder();
        _this.delimiter = '#';
        return _this;
    }
    JsonSocket.prototype.handleSend = function (message, callback) {
        this.socket.write(this.formatMessageData(message), 'utf-8', callback);
    };
    JsonSocket.prototype.handleData = function (dataRaw) {
        var data = buffer_1.Buffer.isBuffer(dataRaw)
            ? this.stringDecoder.write(dataRaw)
            : dataRaw;
        this.buffer += data;
        if (this.contentLength == null) {
            var i = this.buffer.indexOf(this.delimiter);
            /**
             * Check if the buffer has the delimiter (#),
             * if not, the end of the buffer string might be in the middle of a content length string
             */
            if (i !== -1) {
                var rawContentLength = this.buffer.substring(0, i);
                this.contentLength = parseInt(rawContentLength, 10);
                if (isNaN(this.contentLength)) {
                    this.contentLength = null;
                    this.buffer = '';
                    throw new corrupted_packet_length_exception_1.CorruptedPacketLengthException(rawContentLength);
                }
                this.buffer = this.buffer.substring(i + 1);
            }
        }
        if (this.contentLength !== null) {
            var length_1 = this.buffer.length;
            if (length_1 === this.contentLength) {
                this.handleMessage(this.buffer);
            }
            else if (length_1 > this.contentLength) {
                var message = this.buffer.substring(0, this.contentLength);
                var rest = this.buffer.substring(this.contentLength);
                this.handleMessage(message);
                this.handleData(rest);
            }
        }
    };
    JsonSocket.prototype.handleMessage = function (message) {
        this.contentLength = null;
        this.buffer = '';
        this.emitMessage(message);
    };
    JsonSocket.prototype.formatMessageData = function (message) {
        var messageData = JSON.stringify(message);
        var length = messageData.length;
        var data = length + this.delimiter + messageData;
        return data;
    };
    return JsonSocket;
}(tcp_socket_1.TcpSocket));
exports.JsonSocket = JsonSocket;
