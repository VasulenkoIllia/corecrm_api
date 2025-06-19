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
exports.SwaggerInfrastructure = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var SwaggerInfrastructure = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var SwaggerInfrastructure = _classThis = /** @class */ (function () {
        function SwaggerInfrastructure_1(appConfig) {
            this.appConfig = appConfig;
            this.logger = new common_1.Logger(SwaggerInfrastructure.name);
            this.swaggerUrl = '/swagger';
            this.swaggerFileName = 'swagger.json';
        }
        // Ініціалізація Swagger для додатку
        SwaggerInfrastructure_1.prototype.initialize = function (app) {
            try {
                var swaggerDoc = this.getSwaggerSpecDocument(app);
                swagger_1.SwaggerModule.setup(this.swaggerUrl, app, swaggerDoc, {
                    explorer: true,
                    swaggerOptions: {
                        persistAuthorization: true,
                        urls: [{ url: "/".concat(this.swaggerFileName), name: 'API' }],
                    },
                });
                this.logger.log("Swagger UI initialized at ".concat(this.swaggerUrl));
                this.logger.log("Swagger JSON available at /".concat(this.swaggerFileName));
            }
            catch (error) {
                this.logger.error("Failed to initialize Swagger: ".concat(error.message));
                throw error;
            }
        };
        // Генерація Swagger-документа
        SwaggerInfrastructure_1.prototype.getSwaggerSpecDocument = function (app) {
            var title = this.appConfig.SWAGGER_TITLE || 'Banners API';
            var description = this.appConfig.SWAGGER_DESCRIPTION || 'API for managing banners';
            var options = new swagger_1.DocumentBuilder()
                .setTitle(title)
                .setDescription(description)
                .setVersion('1.0')
                .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
                .build();
            return swagger_1.SwaggerModule.createDocument(app, options);
        };
        return SwaggerInfrastructure_1;
    }());
    __setFunctionName(_classThis, "SwaggerInfrastructure");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SwaggerInfrastructure = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SwaggerInfrastructure = _classThis;
}();
exports.SwaggerInfrastructure = SwaggerInfrastructure;
