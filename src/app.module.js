"use strict";
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
// Імпорт необхідних модулів та залежностей
var common_1 = require("@nestjs/common"); // Основний декоратор для створення модулів NestJS
var user_module_1 = require("./components/user/user.module"); // Модуль для роботи з користувачами
var auth_module_1 = require("./components/auth/auth.module"); // Модуль для автентифікації
var app_config_infrastructure_module_1 = require("./infrastructure/app-config/app-config.infrastructure.module"); // Модуль конфігурації додатку
var db_infrastructure_module_1 = require("./infrastructure/db/db.infrastructure.module"); // Модуль для роботи з базою даних
var mapping_infrastructure_module_1 = require("./infrastructure/mapping/mapping.infrastructure.module");
var mail_module_1 = require("./components/mail/mail.module"); // Модуль для маппінгу об'єктів
var invitation_module_1 = require("./components/invitation/invitation.module");
var modules_controller_1 = require("./components/modules/modules.controller");
var modules_module_1 = require("./components/modules/modules.module");
var clients_controller_1 = require("./components/clients/clients.controller");
var clients_service_1 = require("./components/clients/clients.service");
var clients_module_1 = require("./components/clients/clients.module");
var cars_module_1 = require("./components/cars/cars.module");
var cars_controller_1 = require("./components/cars/cars.controller");
var cars_service_1 = require("./components/cars/cars.service");
/**
 * Головний модуль додатку
 * Відповідає за конфігурацію та ініціалізацію всіх компонентів системи
 */
var AppModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                app_config_infrastructure_module_1.AppConfigInfrastructureModule, // Імпорт модуля конфігурації додатку
                db_infrastructure_module_1.DbInfrastructureModule, // Імпорт модуля для роботи з базою даних
                mapping_infrastructure_module_1.MappingInfrastructureModule.registerProfilesAsync(), // Імпорт та реєстрація профілів маппінгу
                user_module_1.UserModule, // Імпорт модуля для роботи з користувачами
                auth_module_1.AuthModule, // Імпорт модуля для автентифікації
                mail_module_1.MailModule,
                invitation_module_1.InvitationModule,
                modules_module_1.ModulesModule,
                clients_module_1.ClientsModule,
                cars_module_1.CarsModule
            ],
            controllers: [modules_controller_1.ModulesController, clients_controller_1.ClientsController, cars_controller_1.CarsController],
            providers: [clients_service_1.ClientsService, cars_service_1.CarsService],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AppModule = _classThis = /** @class */ (function () {
        function AppModule_1() {
        }
        return AppModule_1;
    }());
    __setFunctionName(_classThis, "AppModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AppModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppModule = _classThis;
}();
exports.AppModule = AppModule;
