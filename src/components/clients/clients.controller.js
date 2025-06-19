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
exports.ClientsController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var secure_endpoint_decorator_1 = require("../../common/decorators/secure-endpoint.decorator");
var catch_error_decorator_1 = require("../../common/decorators/catch-error.decorator");
var create_client_dto_1 = require("../../common/dto/client/create-client.dto");
var ClientsController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('clients'), (0, common_1.Controller)('clients'), (0, common_1.SetMetadata)('module', 'clients')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _createClient_decorators;
    var _searchClients_decorators;
    var ClientsController = _classThis = /** @class */ (function () {
        function ClientsController_1(clientsService) {
            this.clientsService = (__runInitializers(this, _instanceExtraInitializers), clientsService);
            this.logger = new common_1.Logger(ClientsController.name);
        }
        ClientsController_1.prototype.createClient = function (createClientDto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    console.log(111);
                    return [2 /*return*/, this.clientsService.createClient(createClientDto, user.companyId, user.id)];
                });
            });
        };
        ClientsController_1.prototype.searchClients = function (searchClientDto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    console.log(111);
                    return [2 /*return*/, this.clientsService.searchClients(searchClientDto, user.companyId, user.id)];
                });
            });
        };
        return ClientsController_1;
    }());
    __setFunctionName(_classThis, "ClientsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createClient_decorators = [(0, secure_endpoint_decorator_1.SecureEndpoint)('', common_1.RequestMethod.POST), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Створити нового клієнта' }), (0, swagger_1.ApiOkResponse)({
                status: 201,
                description: 'Клієнт створено',
                schema: { properties: { message: { type: 'string' }, data: { type: 'object' } } }
            }), (0, swagger_1.ApiBody)({
                type: create_client_dto_1.CreateClientDto,
                examples: {
                    example1: {
                        summary: 'Приклад створення клієнта',
                        value: { firstName: 'Іван', lastName: 'Петренко', phone: '+380671234567', email: 'ivan.petrenko@example.com' },
                    },
                },
            }), (0, catch_error_decorator_1.CatchError)('Створення клієнта')];
        _searchClients_decorators = [(0, secure_endpoint_decorator_1.SecureEndpoint)('search', common_1.RequestMethod.GET), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Пошук клієнтів через Elasticsearch' }), (0, swagger_1.ApiOkResponse)({
                status: 200,
                description: 'Список знайдених клієнтів',
                schema: { properties: { data: { type: 'array', items: { type: 'object' } } } }
            }), (0, swagger_1.ApiQuery)({ name: 'query', type: String, example: 'Іван' }), (0, catch_error_decorator_1.CatchError)('Пошук клієнтів')];
        __esDecorate(_classThis, null, _createClient_decorators, { kind: "method", name: "createClient", static: false, private: false, access: { has: function (obj) { return "createClient" in obj; }, get: function (obj) { return obj.createClient; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _searchClients_decorators, { kind: "method", name: "searchClients", static: false, private: false, access: { has: function (obj) { return "searchClients" in obj; }, get: function (obj) { return obj.searchClients; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ClientsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ClientsController = _classThis;
}();
exports.ClientsController = ClientsController;
