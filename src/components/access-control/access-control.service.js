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
exports.AccessControlService = void 0;
var common_1 = require("@nestjs/common");
var AccessControlService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AccessControlService = _classThis = /** @class */ (function () {
        function AccessControlService_1(prisma) {
            this.prisma = prisma;
            this.logger = new common_1.Logger(AccessControlService.name);
        }
        AccessControlService_1.prototype.checkAccess = function (userId, companyId, options) {
            return __awaiter(this, void 0, void 0, function () {
                var company, validModules, user, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.log("Starting access check for user ".concat(userId, ", company ").concat(companyId, ", options: ").concat(JSON.stringify(options)));
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 5, , 6]);
                            this.logger.log("Fetching company with ID ".concat(companyId));
                            return [4 /*yield*/, this.prisma.company.findUnique({
                                    where: { id: companyId },
                                    include: { users: { where: { userId: userId } } },
                                })];
                        case 2:
                            company = _a.sent();
                            this.logger.log("Company data: ".concat(JSON.stringify(company)));
                            if (!company) {
                                this.logger.warn("Company ".concat(companyId, " not found"));
                                throw new common_1.NotFoundException('Company not found');
                            }
                            if (!company.users.length) {
                                this.logger.warn("User ".concat(userId, " not associated with company ").concat(companyId));
                                throw new common_1.NotFoundException('User not associated with company');
                            }
                            this.logger.log("Checking company status: ".concat(company.status));
                            if (company.status === 'blocked') {
                                this.logger.warn("Company ".concat(companyId, " is blocked"));
                                throw new common_1.ForbiddenException('Company is blocked');
                            }
                            this.logger.log("Checking subscription status: ".concat(company.subscriptionStatus));
                            if (company.subscriptionStatus === 'expired') {
                                this.logger.warn("Company ".concat(companyId, " subscription expired"));
                                throw new common_1.ForbiddenException('Company subscription expired');
                            }
                            this.logger.log("Checking module: ".concat(options.module));
                            if (options.module) {
                                validModules = ['clients', 'cars', 'invoices', 'reports'];
                                if (!validModules.includes(options.module)) {
                                    this.logger.warn("Invalid module: ".concat(options.module));
                                    throw new common_1.ForbiddenException("Invalid module: ".concat(options.module));
                                }
                                this.logger.log("Company modules: ".concat(JSON.stringify(company.modules)));
                                if (!company.modules || typeof company.modules !== 'object') {
                                    this.logger.warn("Invalid modules format for company ".concat(companyId));
                                    throw new common_1.ForbiddenException('Invalid modules configuration');
                                }
                                if (!company.modules[options.module]) {
                                    this.logger.warn("".concat(options.module, " module is disabled for company ").concat(companyId));
                                    throw new common_1.ForbiddenException("".concat(options.module, " module is disabled"));
                                }
                            }
                            this.logger.log("Checking required role: ".concat(options.requiredRole));
                            if (!options.requiredRole) return [3 /*break*/, 4];
                            this.logger.log("Fetching user with ID ".concat(userId));
                            return [4 /*yield*/, this.prisma.user.findUnique({
                                    where: { id: userId },
                                    include: { role: true },
                                })];
                        case 3:
                            user = _a.sent();
                            this.logger.log("User data: ".concat(JSON.stringify(user)));
                            if (!user) {
                                this.logger.warn("User ".concat(userId, " not found"));
                                throw new common_1.NotFoundException('User not found');
                            }
                            if (!user.role) {
                                this.logger.warn("User ".concat(userId, " has no role assigned"));
                                throw new common_1.ForbiddenException('User has no role assigned');
                            }
                            if (user.role.name !== options.requiredRole) {
                                this.logger.warn("User ".concat(userId, " does not have required role ").concat(options.requiredRole));
                                throw new common_1.ForbiddenException("User must have ".concat(options.requiredRole, " role"));
                            }
                            _a.label = 4;
                        case 4:
                            this.logger.log("Access granted for user ".concat(userId, " to company ").concat(companyId));
                            return [2 /*return*/, true];
                        case 5:
                            error_1 = _a.sent();
                            this.logger.error("Access check failed: ".concat(error_1.message, ", stack: ").concat(error_1.stack));
                            throw error_1;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        return AccessControlService_1;
    }());
    __setFunctionName(_classThis, "AccessControlService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AccessControlService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AccessControlService = _classThis;
}();
exports.AccessControlService = AccessControlService;
