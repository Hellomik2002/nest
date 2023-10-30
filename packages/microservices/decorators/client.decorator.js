"use strict";
exports.__esModule = true;
exports.Client = void 0;
var constants_1 = require("../constants");
/**
 * Attaches the `ClientProxy` instance to the given property
 *
 * @param  {ClientOptions} metadata optional client metadata
 *
 * @publicApi
 *
 */
function Client(metadata) {
    return function (target, propertyKey) {
        Reflect.set(target, propertyKey, null);
        Reflect.defineMetadata(constants_1.CLIENT_METADATA, true, target, propertyKey);
        Reflect.defineMetadata(constants_1.CLIENT_CONFIGURATION_METADATA, metadata, target, propertyKey);
    };
}
exports.Client = Client;
