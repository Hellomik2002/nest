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
exports.KafkaContext = void 0;
var base_rpc_context_1 = require("./base-rpc.context");
var KafkaContext = /** @class */ (function (_super) {
    __extends(KafkaContext, _super);
    function KafkaContext(args) {
        return _super.call(this, args) || this;
    }
    /**
     * Returns the reference to the original message.
     */
    KafkaContext.prototype.getMessage = function () {
        return this.args[0];
    };
    /**
     * Returns the partition.
     */
    KafkaContext.prototype.getPartition = function () {
        return this.args[1];
    };
    /**
     * Returns the name of the topic.
     */
    KafkaContext.prototype.getTopic = function () {
        return this.args[2];
    };
    /**
     * Returns the Kafka consumer reference.
     */
    KafkaContext.prototype.getConsumer = function () {
        return this.args[3];
    };
    /**
     * Returns the Kafka heartbeat callback.
     */
    KafkaContext.prototype.getHeartbeat = function () {
        return this.args[4];
    };
    /**
     * Returns the Kafka producer reference,
     */
    KafkaContext.prototype.getProducer = function () {
        return this.args[5];
    };
    return KafkaContext;
}(base_rpc_context_1.BaseRpcContext));
exports.KafkaContext = KafkaContext;
