"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWs = void 0;
var isWs = function (host) {
    return host.getType() == "ws";
};
exports.isWs = isWs;
