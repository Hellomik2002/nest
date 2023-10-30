"use strict";
exports.__esModule = true;
exports.RequestContextHost = void 0;
/**
 * @publicApi
 */
var RequestContextHost = /** @class */ (function () {
    function RequestContextHost(pattern, data, context) {
        this.pattern = pattern;
        this.data = data;
        this.context = context;
    }
    RequestContextHost.create = function (pattern, data, context) {
        var host = new RequestContextHost(pattern, data, context);
        return host;
    };
    RequestContextHost.prototype.getData = function () {
        return this.data;
    };
    RequestContextHost.prototype.getPattern = function () {
        return this.pattern;
    };
    RequestContextHost.prototype.getContext = function () {
        return this.context;
    };
    return RequestContextHost;
}());
exports.RequestContextHost = RequestContextHost;
