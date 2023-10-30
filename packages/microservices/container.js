"use strict";
exports.__esModule = true;
exports.ClientsContainer = void 0;
var ClientsContainer = /** @class */ (function () {
    function ClientsContainer() {
        this.clients = [];
    }
    ClientsContainer.prototype.getAllClients = function () {
        return this.clients;
    };
    ClientsContainer.prototype.addClient = function (client) {
        this.clients.push(client);
    };
    ClientsContainer.prototype.clear = function () {
        this.clients = [];
    };
    return ClientsContainer;
}());
exports.ClientsContainer = ClientsContainer;
