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
exports.DbInfrastructure = void 0;
var common_1 = require("@nestjs/common");
var DbInfrastructure = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var DbInfrastructure = _classThis = /** @class */ (function () {
        function DbInfrastructure_1(prisma, roleService, userService, configService) {
            this.prisma = prisma;
            this.roleService = roleService;
            this.userService = userService;
            this.configService = configService;
            this.logger = new common_1.Logger(DbInfrastructure.name);
        }
        DbInfrastructure_1.prototype.onModuleInit = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.initialize()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        DbInfrastructure_1.prototype.initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.checkDbConnection()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.initRoles()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.initDefaultAdminAccount()];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        DbInfrastructure_1.prototype.checkDbConnection = function () {
            return __awaiter(this, void 0, void 0, function () {
                var retries, retryDelay, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            retries = 3;
                            retryDelay = 2000;
                            _a.label = 1;
                        case 1:
                            if (!(retries > 0)) return [3 /*break*/, 7];
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 6]);
                            return [4 /*yield*/, this.prisma.$connect()];
                        case 3:
                            _a.sent();
                            this.logger.log('Database connection established successfully.');
                            return [2 /*return*/];
                        case 4:
                            error_1 = _a.sent();
                            retries--;
                            this.logger.warn("Failed to connect to the database: ".concat(error_1.message, ". Retries left: ").concat(retries));
                            if (retries === 0) {
                                this.logger.error('Unable to connect to the database after retries.');
                                process.exit(1);
                            }
                            return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, retryDelay); })];
                        case 5:
                            _a.sent();
                            return [3 /*break*/, 6];
                        case 6: return [3 /*break*/, 1];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        DbInfrastructure_1.prototype.initRoles = function () {
            return __awaiter(this, void 0, void 0, function () {
                var existingRoles, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            return [4 /*yield*/, this.roleService.getAllRoles()];
                        case 1:
                            existingRoles = _a.sent();
                            if (!(existingRoles.length === 0)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.roleService.createInitialRoles()];
                        case 2:
                            _a.sent();
                            this.logger.log('Initial roles have been created successfully.');
                            return [3 /*break*/, 4];
                        case 3:
                            this.logger.log('Roles already exist, skipping initialization.');
                            _a.label = 4;
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            error_2 = _a.sent();
                            this.logger.error("Failed to initialize roles: ".concat(error_2.message));
                            throw error_2;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        DbInfrastructure_1.prototype.initDefaultAdminAccount = function () {
            return __awaiter(this, void 0, void 0, function () {
                var adminEmail, adminPassword, adminExists, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            adminEmail = this.configService.get('ADMIN_EMAIL', 'admin@example.com');
                            adminPassword = this.configService.get('ADMIN_PASSWORD', 'securePassword123');
                            return [4 /*yield*/, this.userService.checkUserExists(adminEmail)];
                        case 1:
                            adminExists = _a.sent();
                            if (!!adminExists) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.userService.createAdminUser(adminEmail, adminPassword)];
                        case 2:
                            _a.sent();
                            this.logger.log('Default admin account has been created successfully.');
                            return [3 /*break*/, 4];
                        case 3:
                            this.logger.log('Admin account already exists, skipping initialization.');
                            _a.label = 4;
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            error_3 = _a.sent();
                            this.logger.error("Failed to create default admin account: ".concat(error_3.message));
                            throw error_3;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        return DbInfrastructure_1;
    }());
    __setFunctionName(_classThis, "DbInfrastructure");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DbInfrastructure = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DbInfrastructure = _classThis;
}();
exports.DbInfrastructure = DbInfrastructure;
