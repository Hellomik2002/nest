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
exports.NatsContext = void 0;
var base_rpc_context_1 = require("./base-rpc.context");
var NatsContext = /** @class */ (function (_super) {
    __extends(NatsContext, _super);
    function NatsContext(args) {
        return _super.call(this, args) || this;
    }
    /**
     * Returns the name of the subject.
     */
    NatsContext.prototype.getSubject = function () {
        return this.args[0];
    };
    /**
     * Returns message headers (if exist).
     */
    NatsContext.prototype.getHeaders = function () {
        return this.args[1];
    };
    return NatsContext;
}(base_rpc_context_1.BaseRpcContext));
exports.NatsContext = NatsContext;
