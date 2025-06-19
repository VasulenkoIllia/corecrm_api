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
exports.appConfigProvider = exports.AppConfig = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var AppConfig = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AppConfig = _classThis = /** @class */ (function () {
        function AppConfig_1(configService) {
            this.configService = configService;
            this.logger = new common_1.Logger(AppConfig.name);
            this.validateRequiredEnvVariables();
        }
        Object.defineProperty(AppConfig_1.prototype, "BASE_SITE_URL", {
            get: function () {
                var baseSiteUrl = this.configService.get('BASE_SITE_URL');
                var port = this.configService.get('PORT', 4000);
                return baseSiteUrl || "http://localhost:".concat(port);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AppConfig_1.prototype, "DB_HOST", {
            get: function () {
                return this.configService.get('DB_HOST', 'localhost');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AppConfig_1.prototype, "DB_PORT", {
            get: function () {
                return this.configService.get('DB_PORT', 5433);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AppConfig_1.prototype, "DB_USERNAME", {
            get: function () {
                return this.configService.get('DB_USERNAME', 'admin');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AppConfig_1.prototype, "DB_PASSWORD", {
            get: function () {
                return this.configService.get('DB_PASSWORD', 'admin');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AppConfig_1.prototype, "DB_NAME", {
            get: function () {
                return this.configService.get('DB_NAME', 'template_nest');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AppConfig_1.prototype, "PORT", {
            get: function () {
                return this.configService.get('PORT', 4000);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AppConfig_1.prototype, "JWT_SECRET", {
            get: function () {
                return this.configService.get('JWT_SECRET');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AppConfig_1.prototype, "JWT_EXPIRES_IN", {
            get: function () {
                return this.configService.get('JWT_EXPIRES_IN', '1h');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AppConfig_1.prototype, "BCRYPT_SALT_ROUNDS", {
            get: function () {
                return this.configService.get('BCRYPT_SALT_ROUNDS', 10);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AppConfig_1.prototype, "ADMIN_EMAIL", {
            get: function () {
                return this.configService.get('ADMIN_EMAIL', 'admin@example.com');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AppConfig_1.prototype, "ADMIN_PASSWORD", {
            get: function () {
                return this.configService.get('ADMIN_PASSWORD');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AppConfig_1.prototype, "PROJECT_NAME", {
            get: function () {
                return this.configService.get('PROJECT_NAME');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AppConfig_1.prototype, "REDIS_HOST", {
            get: function () {
                return this.configService.get('REDIS_HOST');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AppConfig_1.prototype, "REDIS_PORT", {
            get: function () {
                return this.configService.get('REDIS_PORT');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AppConfig_1.prototype, "SMTP_HOST", {
            get: function () {
                return this.configService.get('SMTP_HOST');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AppConfig_1.prototype, "SMTP_PORT", {
            get: function () {
                return this.configService.get('SMTP_PORT');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AppConfig_1.prototype, "SMTP_USE_SSL", {
            get: function () {
                return this.configService.get('SMTP_USE_SSL');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AppConfig_1.prototype, "SMTP_USER_NAME", {
            get: function () {
                return this.configService.get('SMTP_USER_NAME');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AppConfig_1.prototype, "SMTP_PASSWORD", {
            get: function () {
                return this.configService.get('SMTP_PASSWORD');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AppConfig_1.prototype, "SMTP_SENDER_EMAIL", {
            get: function () {
                return this.configService.get('SMTP_SENDER_EMAIL');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AppConfig_1.prototype, "SMTP_GMAIL_USER", {
            get: function () {
                return this.configService.get('SMTP_GMAIL_USER');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AppConfig_1.prototype, "SMTP_GMAIL_PASS", {
            get: function () {
                return this.configService.get('SMTP_GMAIL_PASS');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AppConfig_1.prototype, "LOGGER_LEVEL_SECURITY", {
            get: function () {
                return this.configService.get('LOGGER_LEVEL_SECURITY');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AppConfig_1.prototype, "LOGGER_HIDE_VALUES", {
            get: function () {
                return this.configService.get('LOGGER_HIDE_VALUES');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AppConfig_1.prototype, "LOGGER_LEVEL", {
            get: function () {
                return this.configService.get('LOGGER_LEVEL');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AppConfig_1.prototype, "BUILD_VERSION", {
            get: function () {
                return this.configService.get('BUILD_VERSION');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AppConfig_1.prototype, "TELEGRAM_API_TOKEN", {
            get: function () {
                return this.configService.get('TELEGRAM_API_TOKEN');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AppConfig_1.prototype, "SWAGGER_TITLE", {
            get: function () {
                return this.configService.get('SWAGGER_TITLE');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AppConfig_1.prototype, "SWAGGER_DESCRIPTION", {
            get: function () {
                return this.configService.get('SWAGGER_DESCRIPTION');
            },
            enumerable: false,
            configurable: true
        });
        AppConfig_1.prototype.validateRequiredEnvVariables = function () {
            var requiredVars = [
                'DB_HOST',
                'DB_PORT',
                'DB_USERNAME',
                'DB_PASSWORD',
                'DB_NAME',
                'PORT',
                'JWT_SECRET',
                'JWT_EXPIRES_IN',
                'BCRYPT_SALT_ROUNDS',
                'ADMIN_EMAIL',
                'ADMIN_PASSWORD',
            ];
            for (var _i = 0, requiredVars_1 = requiredVars; _i < requiredVars_1.length; _i++) {
                var varName = requiredVars_1[_i];
                if (this.configService.get(varName) == null) {
                    this.logger.error("Missing required environment variable: ".concat(varName));
                    throw new Error("Environment variable ".concat(varName, " is not defined"));
                }
            }
        };
        return AppConfig_1;
    }());
    __setFunctionName(_classThis, "AppConfig");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AppConfig = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppConfig = _classThis;
}();
exports.AppConfig = AppConfig;
exports.appConfigProvider = {
    provide: AppConfig,
    useFactory: function (configService) { return new AppConfig(configService); },
    inject: [config_1.ConfigService],
};
