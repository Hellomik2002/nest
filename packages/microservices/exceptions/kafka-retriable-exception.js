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
exports.KafkaRetriableException = void 0;
var rpc_exception_1 = require("./rpc-exception");
/**
 * Exception that instructs Kafka driver to instead of introspecting
 * error processing flow and sending serialized error message to the consumer,
 * force bubble it up to the "eachMessage" callback of the underlying "kafkajs" package
 * (even if interceptors are applied, or an observable stream is returned from the message handler).
 *
 * A transient exception that if retried may succeed.
 *
 * @publicApi
 */
var KafkaRetriableException = /** @class */ (function (_super) {
    __extends(KafkaRetriableException, _super);
    function KafkaRetriableException() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KafkaRetriableException.prototype.getError = function () {
        return this;
    };
    return KafkaRetriableException;
}(rpc_exception_1.RpcException));
exports.KafkaRetriableException = KafkaRetriableException;
