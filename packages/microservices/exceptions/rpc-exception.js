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
exports.RpcException = void 0;
var shared_utils_1 = require("@nestjs/common/utils/shared.utils");
/**
 * @publicApi
 */
var RpcException = /** @class */ (function (_super) {
    __extends(RpcException, _super);
    function RpcException(error) {
        var _this = _super.call(this) || this;
        _this.error = error;
        _this.initMessage();
        return _this;
    }
    RpcException.prototype.initMessage = function () {
        if ((0, shared_utils_1.isString)(this.error)) {
            this.message = this.error;
        }
        else if ((0, shared_utils_1.isObject)(this.error) &&
            (0, shared_utils_1.isString)(this.error.message)) {
            this.message = this.error.message;
        }
        else if (this.constructor) {
            this.message = this.constructor.name
                .match(/[A-Z][a-z]+|[0-9]+/g)
                .join(' ');
        }
    };
    RpcException.prototype.getError = function () {
        return this.error;
    };
    return RpcException;
}(Error));
exports.RpcException = RpcException;
