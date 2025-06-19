"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var login_response_dto_1 = require("../../common/dto/user/login.response.dto");
var login_request_dto_1 = require("../../common/dto/user/login.request.dto");
var public_guard_1 = require("./guards/public.guard");
var register_company_dto_1 = require("../../common/dto/auth/register-company.dto");
var register_employee_dto_1 = require("../../common/dto/auth/register-employee.dto");
var access_control_endpoint_decorator_1 = require("../../common/decorators/access-control-endpoint.decorator");
var reset_password_dto_1 = require("../../common/dto/auth/reset-password.dto");
var request_password_reset_dto_1 = require("../../common/dto/auth/request-password-reset.dto");
var catch_error_decorator_1 = require("../../common/decorators/catch-error.decorator");
var AuthController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Auth'), (0, common_1.Controller)('auth')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _registerCompany_decorators;
    var _registerEmployee_decorators;
    var _signIn_decorators;
    var _refreshToken_decorators;
    var _confirmEmail_decorators;
    var _requestPasswordReset_decorators;
    var _resetPassword_decorators;
    var AuthController = _classThis = /** @class */ (function () {
        function AuthController_1(authService) {
            this.authService = (__runInitializers(this, _instanceExtraInitializers), authService);
            this.logger = new common_1.Logger(AuthController.name);
        }
        AuthController_1.prototype.registerCompany = function (registerCompanyDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.authService.registerCompany(registerCompanyDto)];
                });
            });
        };
        AuthController_1.prototype.registerEmployee = function (registerEmployeeDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    console.log(111);
                    return [2 /*return*/, this.authService.registerEmployee(registerEmployeeDto)];
                });
            });
        };
        AuthController_1.prototype.signIn = function (signInDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.authService.signIn(signInDto.email, signInDto.password)];
                });
            });
        };
        AuthController_1.prototype.refreshToken = function (refreshDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.authService.refreshToken(refreshDto.refreshToken)];
                });
            });
        };
        AuthController_1.prototype.confirmEmail = function (token) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.authService.confirmEmail(token)];
                });
            });
        };
        AuthController_1.prototype.requestPasswordReset = function (body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.authService.requestPasswordReset(body.email)];
                });
            });
        };
        AuthController_1.prototype.resetPassword = function (body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.authService.resetPassword(body.token, body.newPassword)];
                });
            });
        };
        return AuthController_1;
    }());
    __setFunctionName(_classThis, "AuthController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _registerCompany_decorators = [(0, public_guard_1.Public)(), (0, common_1.Post)('register/company'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Register a new company and director' }), (0, swagger_1.ApiOkResponse)({ status: 201, description: 'Company and director created', schema: { properties: { message: { type: 'string' } } } }), (0, swagger_1.ApiBody)({
                type: register_company_dto_1.RegisterCompanyDTO,
            }), (0, catch_error_decorator_1.CatchError)('Registering company')];
        _registerEmployee_decorators = [(0, public_guard_1.Public)(), (0, common_1.Post)('register/employee'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Register an employee with an invitation token' }), (0, swagger_1.ApiOkResponse)({ status: 201, description: 'Employee registered', schema: { properties: { message: { type: 'string' } } } }), (0, swagger_1.ApiBody)({ type: register_employee_dto_1.RegisterEmployeeDTO }), (0, catch_error_decorator_1.CatchError)('Registering employee')];
        _signIn_decorators = [(0, public_guard_1.Public)(), (0, common_1.Post)('login'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'User login' }), (0, swagger_1.ApiOkResponse)({ status: 200, type: login_response_dto_1.LoginResponseDTO }), (0, swagger_1.ApiBody)({ type: login_request_dto_1.LoginRequestDTO }), (0, catch_error_decorator_1.CatchError)('User login')];
        _refreshToken_decorators = [(0, access_control_endpoint_decorator_1.AccessControlEndpoint)('refresh', {}, common_1.RequestMethod.POST), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Refresh JWT token' }), (0, swagger_1.ApiOkResponse)({ status: 200, type: login_response_dto_1.LoginResponseDTO }), (0, catch_error_decorator_1.CatchError)('Refreshing token')];
        _confirmEmail_decorators = [(0, public_guard_1.Public)(), (0, common_1.Get)('confirm-email'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Confirm user email with token' }), (0, swagger_1.ApiOkResponse)({ status: 200, description: 'Email confirmed', schema: { properties: { message: { type: 'string' } } } }), (0, catch_error_decorator_1.CatchError)('Confirming email')];
        _requestPasswordReset_decorators = [(0, public_guard_1.Public)(), (0, common_1.Post)('reset-password/request'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Request a password reset' }), (0, swagger_1.ApiOkResponse)({ status: 200, description: 'Password reset email sent', schema: { properties: { message: { type: 'string' } } } }), (0, swagger_1.ApiBody)({ type: request_password_reset_dto_1.RequestPasswordResetDTO }), (0, catch_error_decorator_1.CatchError)('Requesting password reset')];
        _resetPassword_decorators = [(0, public_guard_1.Public)(), (0, common_1.Post)('reset-password'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Reset password with token' }), (0, swagger_1.ApiOkResponse)({ status: 200, description: 'Password reset successfully', schema: { properties: { message: { type: 'string' } } } }), (0, swagger_1.ApiBody)({ type: reset_password_dto_1.ResetPasswordDTO }), (0, catch_error_decorator_1.CatchError)('Resetting password')];
        __esDecorate(_classThis, null, _registerCompany_decorators, { kind: "method", name: "registerCompany", static: false, private: false, access: { has: function (obj) { return "registerCompany" in obj; }, get: function (obj) { return obj.registerCompany; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _registerEmployee_decorators, { kind: "method", name: "registerEmployee", static: false, private: false, access: { has: function (obj) { return "registerEmployee" in obj; }, get: function (obj) { return obj.registerEmployee; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _signIn_decorators, { kind: "method", name: "signIn", static: false, private: false, access: { has: function (obj) { return "signIn" in obj; }, get: function (obj) { return obj.signIn; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _refreshToken_decorators, { kind: "method", name: "refreshToken", static: false, private: false, access: { has: function (obj) { return "refreshToken" in obj; }, get: function (obj) { return obj.refreshToken; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _confirmEmail_decorators, { kind: "method", name: "confirmEmail", static: false, private: false, access: { has: function (obj) { return "confirmEmail" in obj; }, get: function (obj) { return obj.confirmEmail; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _requestPasswordReset_decorators, { kind: "method", name: "requestPasswordReset", static: false, private: false, access: { has: function (obj) { return "requestPasswordReset" in obj; }, get: function (obj) { return obj.requestPasswordReset; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _resetPassword_decorators, { kind: "method", name: "resetPassword", static: false, private: false, access: { has: function (obj) { return "resetPassword" in obj; }, get: function (obj) { return obj.resetPassword; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthController = _classThis;
}();
exports.AuthController = AuthController;
