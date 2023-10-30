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
exports.NetSocketClosedException = void 0;
/**
 * @publicApi
 */
var NetSocketClosedException = /** @class */ (function (_super) {
    __extends(NetSocketClosedException, _super);
    function NetSocketClosedException() {
        return _super.call(this, "The net socket is closed.") || this;
    }
    return NetSocketClosedException;
}(Error));
exports.NetSocketClosedException = NetSocketClosedException;
