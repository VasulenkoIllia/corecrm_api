"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessControlEndpoint = exports.ACCESS_CONTROL_METADATA = void 0;
var common_1 = require("@nestjs/common");
var endpoint_decorator_1 = require("./endpoint.decorator");
var swagger_1 = require("@nestjs/swagger");
var jwt_guard_1 = require("../../components/auth/guards/jwt.guard");
var access_control_guard_1 = require("../../components/access-control/access-control.guard");
var role_guard_1 = require("../../components/access-control/role.guard");
exports.ACCESS_CONTROL_METADATA = 'access_control_metadata';
var AccessControlEndpoint = function (route, options, httpRequestMethod) {
    if (options === void 0) { options = {}; }
    if (httpRequestMethod === void 0) { httpRequestMethod = common_1.RequestMethod.POST; }
    var decorators = [
        (0, swagger_1.ApiBearerAuth)(),
        (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
        (0, common_1.SetMetadata)(exports.ACCESS_CONTROL_METADATA, { accessOptions: options, requiredRole: options.requiredRole }),
        (0, common_1.UseGuards)(access_control_guard_1.AccessControlGuard),
        (0, endpoint_decorator_1.Endpoint)(route, httpRequestMethod),
    ];
    if (options.requiredRole) {
        decorators.push((0, common_1.UseGuards)(role_guard_1.RoleGuard));
    }
    return common_1.applyDecorators.apply(void 0, decorators);
};
exports.AccessControlEndpoint = AccessControlEndpoint;
