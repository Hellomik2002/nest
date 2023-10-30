"use strict";
exports.__esModule = true;
exports.ClientProxyFactory = void 0;
var transport_enum_1 = require("../enums/transport.enum");
var client_grpc_1 = require("./client-grpc");
var client_kafka_1 = require("./client-kafka");
var client_mqtt_1 = require("./client-mqtt");
var client_nats_1 = require("./client-nats");
var client_redis_1 = require("./client-redis");
var client_rmq_1 = require("./client-rmq");
var client_tcp_1 = require("./client-tcp");
/**
 * @publicApi
 */
var ClientProxyFactory = /** @class */ (function () {
    function ClientProxyFactory() {
    }
    ClientProxyFactory.create = function (clientOptions) {
        if (this.isCustomClientOptions(clientOptions)) {
            var customClass = clientOptions.customClass, options_1 = clientOptions.options;
            return new customClass(options_1);
        }
        var _a = clientOptions || {}, transport = _a.transport, options = _a.options;
        switch (transport) {
            case transport_enum_1.Transport.REDIS:
                return new client_redis_1.ClientRedis(options);
            case transport_enum_1.Transport.NATS:
                return new client_nats_1.ClientNats(options);
            case transport_enum_1.Transport.MQTT:
                return new client_mqtt_1.ClientMqtt(options);
            case transport_enum_1.Transport.GRPC:
                return new client_grpc_1.ClientGrpcProxy(options);
            case transport_enum_1.Transport.RMQ:
                return new client_rmq_1.ClientRMQ(options);
            case transport_enum_1.Transport.KAFKA:
                return new client_kafka_1.ClientKafka(options);
            default:
                return new client_tcp_1.ClientTCP(options);
        }
    };
    ClientProxyFactory.isCustomClientOptions = function (options) {
        return !!options.customClass;
    };
    return ClientProxyFactory;
}());
exports.ClientProxyFactory = ClientProxyFactory;
