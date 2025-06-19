"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminEndpoint = void 0;
var common_1 = require("@nestjs/common");
var endpoint_decorator_1 = require("./endpoint.decorator");
var swagger_1 = require("@nestjs/swagger");
var decorators_1 = require("@nestjs/common/decorators");
var jwt_guard_1 = require("../../components/auth/guards/jwt.guard");
var admin_guard_1 = require("../../components/auth/guards/admin.guard");
var AdminEndpoint = function (route, httpRequestMethod) {
    if (httpRequestMethod === void 0) { httpRequestMethod = common_1.RequestMethod.POST; }
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBearerAuth)(), (0, admin_guard_1.Admin)(), (0, decorators_1.UseGuards)(jwt_guard_1.JwtGuard), (0, endpoint_decorator_1.Endpoint)(route, httpRequestMethod));
};
exports.AdminEndpoint = AdminEndpoint;
