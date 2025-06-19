"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHttpEndpointDecorator = exports.Endpoint = void 0;
var common_1 = require("@nestjs/common");
var Endpoint = function (route, httpRequestMethod) {
    if (httpRequestMethod === void 0) { httpRequestMethod = common_1.RequestMethod.POST; }
    return (0, common_1.applyDecorators)((0, exports.getHttpEndpointDecorator)(route, httpRequestMethod));
};
exports.Endpoint = Endpoint;
var getHttpEndpointDecorator = function (route, httpRequestMethod) {
    switch (httpRequestMethod) {
        case common_1.RequestMethod.GET:
            return (0, common_1.Get)(route);
        case common_1.RequestMethod.POST:
            return (0, common_1.Post)(route);
        case common_1.RequestMethod.PUT:
            return (0, common_1.Put)(route);
        case common_1.RequestMethod.DELETE:
            return (0, common_1.Delete)(route);
        case common_1.RequestMethod.PATCH:
            return (0, common_1.Patch)(route);
        case common_1.RequestMethod.HEAD:
            return (0, common_1.Head)(route);
        case common_1.RequestMethod.OPTIONS:
            return (0, common_1.Options)(route);
    }
};
exports.getHttpEndpointDecorator = getHttpEndpointDecorator;
