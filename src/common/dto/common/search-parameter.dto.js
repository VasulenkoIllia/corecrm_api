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
exports.SearchParameterDTO = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
// DTO для параметрів пошуку API
var SearchParameterDTO = function () {
    var _a;
    var _searchBy_decorators;
    var _searchBy_initializers = [];
    var _searchBy_extraInitializers = [];
    var _query_decorators;
    var _query_initializers = [];
    var _query_extraInitializers = [];
    var _page_decorators;
    var _page_initializers = [];
    var _page_extraInitializers = [];
    var _pageSize_decorators;
    var _pageSize_initializers = [];
    var _pageSize_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SearchParameterDTO() {
                // Поля, за якими виконується пошук
                this.searchBy = __runInitializers(this, _searchBy_initializers, void 0);
                // Текстовий запит для пошуку
                this.query = (__runInitializers(this, _searchBy_extraInitializers), __runInitializers(this, _query_initializers, void 0));
                // Номер сторінки
                this.page = (__runInitializers(this, _query_extraInitializers), __runInitializers(this, _page_initializers, void 0));
                // Розмір сторінки
                this.pageSize = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _pageSize_initializers, void 0));
                __runInitializers(this, _pageSize_extraInitializers);
            }
            return SearchParameterDTO;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _searchBy_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Fields to search by',
                    isArray: true,
                    required: false,
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)()];
            _query_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Search query string',
                    example: 'John',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _page_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Page number',
                    example: 1,
                    required: false,
                }), (0, class_validator_1.IsInt)(), (0, class_validator_1.IsPositive)(), (0, class_validator_1.IsOptional)()];
            _pageSize_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Number of items per page',
                    example: 10,
                    required: false,
                }), (0, class_validator_1.IsInt)(), (0, class_validator_1.IsPositive)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _searchBy_decorators, { kind: "field", name: "searchBy", static: false, private: false, access: { has: function (obj) { return "searchBy" in obj; }, get: function (obj) { return obj.searchBy; }, set: function (obj, value) { obj.searchBy = value; } }, metadata: _metadata }, _searchBy_initializers, _searchBy_extraInitializers);
            __esDecorate(null, null, _query_decorators, { kind: "field", name: "query", static: false, private: false, access: { has: function (obj) { return "query" in obj; }, get: function (obj) { return obj.query; }, set: function (obj, value) { obj.query = value; } }, metadata: _metadata }, _query_initializers, _query_extraInitializers);
            __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: function (obj) { return "page" in obj; }, get: function (obj) { return obj.page; }, set: function (obj, value) { obj.page = value; } }, metadata: _metadata }, _page_initializers, _page_extraInitializers);
            __esDecorate(null, null, _pageSize_decorators, { kind: "field", name: "pageSize", static: false, private: false, access: { has: function (obj) { return "pageSize" in obj; }, get: function (obj) { return obj.pageSize; }, set: function (obj, value) { obj.pageSize = value; } }, metadata: _metadata }, _pageSize_initializers, _pageSize_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.SearchParameterDTO = SearchParameterDTO;
