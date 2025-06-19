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
exports.ModulesController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var secure_endpoint_decorator_1 = require("../../common/decorators/secure-endpoint.decorator");
var catch_error_decorator_1 = require("../../common/decorators/catch-error.decorator");
var modules_dto_1 = require("../../common/dto/module/modules.dto");
var ModulesController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('modules'), (0, common_1.Controller)('modules')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _activateModule_decorators;
    var _getModules_decorators;
    var _updateModules_decorators;
    var _deactivateModule_decorators;
    var ModulesController = _classThis = /** @class */ (function () {
        function ModulesController_1(modulesService) {
            this.modulesService = (__runInitializers(this, _instanceExtraInitializers), modulesService);
            this.logger = new common_1.Logger(ModulesController.name);
        }
        ModulesController_1.prototype.activateModule = function (moduleName, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.modulesService.activateModule(user.companyId, moduleName, user.id)];
                });
            });
        };
        ModulesController_1.prototype.getModules = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    console.log(111);
                    return [2 /*return*/, this.modulesService.getModules(user.companyId, user.id)];
                });
            });
        };
        ModulesController_1.prototype.updateModules = function (modulesDto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.modulesService.updateModules(user.companyId, modulesDto, user.id)];
                });
            });
        };
        ModulesController_1.prototype.deactivateModule = function (moduleName, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    console.log(111);
                    return [2 /*return*/, this.modulesService.deactivateModule(user.companyId, moduleName, user.id)];
                });
            });
        };
        return ModulesController_1;
    }());
    __setFunctionName(_classThis, "ModulesController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _activateModule_decorators = [(0, secure_endpoint_decorator_1.SecureEndpoint)(':moduleName', common_1.RequestMethod.POST), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Активувати модуль для компанії' }), (0, swagger_1.ApiOkResponse)({
                status: 200,
                description: 'Модуль активовано',
                schema: { properties: { message: { type: 'string' }, data: { type: 'object' } } }
            }), (0, swagger_1.ApiParam)({ name: 'moduleName', description: 'Назва модуля (clients, cars, invoices, reports)', example: 'clients' }), (0, catch_error_decorator_1.CatchError)('Активація модуля'), (0, common_1.SetMetadata)('requiredRole', 'director')];
        _getModules_decorators = [(0, secure_endpoint_decorator_1.SecureEndpoint)('', common_1.RequestMethod.GET), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Отримати активні модулі компанії' }), (0, swagger_1.ApiOkResponse)({
                status: 200,
                description: 'Список активних модулів',
                schema: { properties: { data: { type: 'object' } } }
            }), (0, catch_error_decorator_1.CatchError)('Отримання модулів')];
        _updateModules_decorators = [(0, secure_endpoint_decorator_1.SecureEndpoint)('', common_1.RequestMethod.PATCH), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Оновити модулі компанії' }), (0, swagger_1.ApiOkResponse)({
                status: 200,
                description: 'Модулі оновлено',
                schema: { properties: { message: { type: 'string' }, data: { type: 'object' } } }
            }), (0, swagger_1.ApiBody)({
                type: modules_dto_1.UpdateModulesDto,
                examples: {
                    example1: {
                        summary: 'Приклад оновлення модулів',
                        value: { clients: true, cars: false, invoices: true, reports: false },
                    },
                },
            }), (0, catch_error_decorator_1.CatchError)('Оновлення модулів'), (0, common_1.SetMetadata)('requiredRole', 'director')];
        _deactivateModule_decorators = [(0, secure_endpoint_decorator_1.SecureEndpoint)(':moduleName', common_1.RequestMethod.DELETE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Деактивувати модуль для компанії' }), (0, swagger_1.ApiOkResponse)({
                status: 200,
                description: 'Модуль деактивовано',
                schema: { properties: { message: { type: 'string' }, data: { type: 'object' } } }
            }), (0, swagger_1.ApiParam)({ name: 'moduleName', description: 'Назва модуля (clients, cars, invoices, reports)', example: 'clients' }), (0, catch_error_decorator_1.CatchError)('Деактивація модуля'), (0, common_1.SetMetadata)('requiredRole', 'director')];
        __esDecorate(_classThis, null, _activateModule_decorators, { kind: "method", name: "activateModule", static: false, private: false, access: { has: function (obj) { return "activateModule" in obj; }, get: function (obj) { return obj.activateModule; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getModules_decorators, { kind: "method", name: "getModules", static: false, private: false, access: { has: function (obj) { return "getModules" in obj; }, get: function (obj) { return obj.getModules; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateModules_decorators, { kind: "method", name: "updateModules", static: false, private: false, access: { has: function (obj) { return "updateModules" in obj; }, get: function (obj) { return obj.updateModules; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deactivateModule_decorators, { kind: "method", name: "deactivateModule", static: false, private: false, access: { has: function (obj) { return "deactivateModule" in obj; }, get: function (obj) { return obj.deactivateModule; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ModulesController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ModulesController = _classThis;
}();
exports.ModulesController = ModulesController;
