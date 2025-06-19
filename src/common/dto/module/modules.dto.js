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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateModulesDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var UpdateModulesDto = function () {
    var _a;
    var _clients_decorators;
    var _clients_initializers = [];
    var _clients_extraInitializers = [];
    var _cars_decorators;
    var _cars_initializers = [];
    var _cars_extraInitializers = [];
    var _invoices_decorators;
    var _invoices_initializers = [];
    var _invoices_extraInitializers = [];
    var _reports_decorators;
    var _reports_initializers = [];
    var _reports_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateModulesDto() {
                this.clients = __runInitializers(this, _clients_initializers, void 0);
                this.cars = (__runInitializers(this, _clients_extraInitializers), __runInitializers(this, _cars_initializers, void 0));
                this.invoices = (__runInitializers(this, _cars_extraInitializers), __runInitializers(this, _invoices_initializers, void 0));
                this.reports = (__runInitializers(this, _invoices_extraInitializers), __runInitializers(this, _reports_initializers, void 0));
                __runInitializers(this, _reports_extraInitializers);
            }
            return UpdateModulesDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _clients_decorators = [(0, swagger_1.ApiProperty)({ example: true, description: 'Статус модуля clients', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _cars_decorators = [(0, swagger_1.ApiProperty)({ example: false, description: 'Статус модуля cars', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _invoices_decorators = [(0, swagger_1.ApiProperty)({ example: true, description: 'Статус модуля invoices', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _reports_decorators = [(0, swagger_1.ApiProperty)({ example: false, description: 'Статус модуля reports', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _clients_decorators, { kind: "field", name: "clients", static: false, private: false, access: { has: function (obj) { return "clients" in obj; }, get: function (obj) { return obj.clients; }, set: function (obj, value) { obj.clients = value; } }, metadata: _metadata }, _clients_initializers, _clients_extraInitializers);
            __esDecorate(null, null, _cars_decorators, { kind: "field", name: "cars", static: false, private: false, access: { has: function (obj) { return "cars" in obj; }, get: function (obj) { return obj.cars; }, set: function (obj, value) { obj.cars = value; } }, metadata: _metadata }, _cars_initializers, _cars_extraInitializers);
            __esDecorate(null, null, _invoices_decorators, { kind: "field", name: "invoices", static: false, private: false, access: { has: function (obj) { return "invoices" in obj; }, get: function (obj) { return obj.invoices; }, set: function (obj, value) { obj.invoices = value; } }, metadata: _metadata }, _invoices_initializers, _invoices_extraInitializers);
            __esDecorate(null, null, _reports_decorators, { kind: "field", name: "reports", static: false, private: false, access: { has: function (obj) { return "reports" in obj; }, get: function (obj) { return obj.reports; }, set: function (obj, value) { obj.reports = value; } }, metadata: _metadata }, _reports_initializers, _reports_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateModulesDto = UpdateModulesDto;
