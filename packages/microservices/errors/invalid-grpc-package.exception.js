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
exports.InvalidGrpcPackageException = void 0;
var runtime_exception_1 = require("@nestjs/core/errors/exceptions/runtime.exception");
/**
 * @publicApi
 */
var InvalidGrpcPackageException = /** @class */ (function (_super) {
    __extends(InvalidGrpcPackageException, _super);
    function InvalidGrpcPackageException(name) {
        return _super.call(this, "The invalid gRPC package (package \"".concat(name, "\" not found)")) || this;
    }
    return InvalidGrpcPackageException;
}(runtime_exception_1.RuntimeException));
exports.InvalidGrpcPackageException = InvalidGrpcPackageException;
