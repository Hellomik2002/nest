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
exports.InvalidKafkaClientTopicException = void 0;
var runtime_exception_1 = require("@nestjs/core/errors/exceptions/runtime.exception");
/**
 * @publicApi
 */
var InvalidKafkaClientTopicException = /** @class */ (function (_super) {
    __extends(InvalidKafkaClientTopicException, _super);
    function InvalidKafkaClientTopicException(topic) {
        return _super.call(this, "The client consumer did not subscribe to the corresponding reply topic (".concat(topic, ").")) || this;
    }
    return InvalidKafkaClientTopicException;
}(runtime_exception_1.RuntimeException));
exports.InvalidKafkaClientTopicException = InvalidKafkaClientTopicException;
