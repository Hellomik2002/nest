"use strict";
exports.__esModule = true;
exports.transformPatternToRoute = void 0;
var shared_utils_1 = require("@nestjs/common/utils/shared.utils");
/**
 * Transforms the Pattern to Route.
 * 1. If Pattern is a `string`, it will be returned as it is.
 * 2. If Pattern is a `number`, it will be converted to `string`.
 * 3. If Pattern is a `JSON` object, it will be transformed to Route. For that end,
 * the function will sort properties of `JSON` Object and creates `route` string
 * according to the following template:
 * <key1>:<value1>/<key2>:<value2>/.../<keyN>:<valueN>
 *
 * @param  {MsPattern} pattern - client pattern
 * @returns string
 */
function transformPatternToRoute(pattern) {
    if ((0, shared_utils_1.isString)(pattern) || (0, shared_utils_1.isNumber)(pattern)) {
        return "".concat(pattern);
    }
    if (!(0, shared_utils_1.isObject)(pattern)) {
        return pattern;
    }
    var sortedKeys = Object.keys(pattern).sort(function (a, b) {
        return ('' + a).localeCompare(b);
    });
    // Creates the array of Pattern params from sorted keys and their corresponding values
    var sortedPatternParams = sortedKeys.map(function (key) {
        var partialRoute = "\"".concat(key, "\":");
        partialRoute += (0, shared_utils_1.isString)(pattern[key])
            ? "\"".concat(transformPatternToRoute(pattern[key]), "\"")
            : transformPatternToRoute(pattern[key]);
        return partialRoute;
    });
    var route = sortedPatternParams.join(',');
    return "{".concat(route, "}");
}
exports.transformPatternToRoute = transformPatternToRoute;
