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
exports.EmptyResponseException = void 0;
/**
 * @publicApi
 */
var EmptyResponseException = /** @class */ (function (_super) {
    __extends(EmptyResponseException, _super);
    function EmptyResponseException(pattern) {
        return _super.call(this, "Empty response. There are no subscribers listening to that message (\"".concat(pattern, "\")")) || this;
    }
    return EmptyResponseException;
}(Error));
exports.EmptyResponseException = EmptyResponseException;
