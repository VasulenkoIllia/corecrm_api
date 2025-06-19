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
exports.UserService = void 0;
var common_1 = require("@nestjs/common");
var bcrypt = require("bcrypt");
var uuid_1 = require("uuid");
var UserService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var UserService = _classThis = /** @class */ (function () {
        function UserService_1(prisma) {
            this.prisma = prisma;
            this.logger = new common_1.Logger(UserService.name);
        }
        UserService_1.prototype.createUser = function (data_1) {
            return __awaiter(this, arguments, void 0, function (data, prismaClient) {
                var email, password, name, roleName, confirmationToken, _a, isEmailConfirmed, hashedPassword, role, user;
                if (prismaClient === void 0) { prismaClient = this.prisma; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            email = data.email, password = data.password, name = data.name, roleName = data.roleName, confirmationToken = data.confirmationToken, _a = data.isEmailConfirmed, isEmailConfirmed = _a === void 0 ? false : _a;
                            return [4 /*yield*/, this.checkUserExists(email, prismaClient)];
                        case 1:
                            if (_b.sent()) {
                                this.logger.warn("User with email ".concat(email, " already exists"));
                                throw new common_1.BadRequestException('Email already exists');
                            }
                            return [4 /*yield*/, bcrypt.hash(password, 10)];
                        case 2:
                            hashedPassword = _b.sent();
                            return [4 /*yield*/, this.findRoleByName(roleName, prismaClient)];
                        case 3:
                            role = _b.sent();
                            return [4 /*yield*/, prismaClient.user.create({
                                    data: {
                                        email: email,
                                        password: hashedPassword,
                                        name: name,
                                        roleId: role.id,
                                        confirmationToken: confirmationToken || (0, uuid_1.v4)(),
                                        isEmailConfirmed: isEmailConfirmed,
                                    },
                                })];
                        case 4:
                            user = _b.sent();
                            if (!data.companyId) return [3 /*break*/, 6];
                            return [4 /*yield*/, prismaClient.companyUsers.create({
                                    data: {
                                        userId: user.id,
                                        companyId: data.companyId,
                                    },
                                })];
                        case 5:
                            _b.sent();
                            _b.label = 6;
                        case 6: return [2 /*return*/, user];
                    }
                });
            });
        };
        UserService_1.prototype.findByEmailForAuth = function (email) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.user.findUnique({
                            where: { email: email },
                            include: { role: true },
                        })];
                });
            });
        };
        UserService_1.prototype.findById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.user.findUnique({
                            where: { id: id },
                            include: { role: true, companies: { include: { company: true } } },
                        })];
                });
            });
        };
        UserService_1.prototype.findCompanyUser = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var companyUser;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.companyUsers.findFirst({
                                where: { userId: userId },
                            })];
                        case 1:
                            companyUser = _a.sent();
                            if (!companyUser) {
                                throw new common_1.NotFoundException('User not associated with any company');
                            }
                            return [2 /*return*/, companyUser];
                    }
                });
            });
        };
        UserService_1.prototype.checkUserExists = function (email_1) {
            return __awaiter(this, arguments, void 0, function (email, prismaClient) {
                var user;
                if (prismaClient === void 0) { prismaClient = this.prisma; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, prismaClient.user.findUnique({
                                where: { email: email },
                            })];
                        case 1:
                            user = _a.sent();
                            return [2 /*return*/, !!user];
                    }
                });
            });
        };
        UserService_1.prototype.createAdminUser = function (email, password) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.createUser({
                            email: email,
                            password: password,
                            name: 'Admin',
                            roleName: 'superadmin',
                            isEmailConfirmed: true,
                        })];
                });
            });
        };
        UserService_1.prototype.findRoleByName = function (name_1) {
            return __awaiter(this, arguments, void 0, function (name, prismaClient) {
                var role;
                if (prismaClient === void 0) { prismaClient = this.prisma; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, prismaClient.role.findUnique({
                                where: { name: name },
                            })];
                        case 1:
                            role = _a.sent();
                            if (!role) {
                                throw new common_1.NotFoundException("Role ".concat(name, " not found"));
                            }
                            return [2 /*return*/, role];
                    }
                });
            });
        };
        UserService_1.prototype.findCompanyById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var company;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.company.findUnique({
                                where: { id: id },
                            })];
                        case 1:
                            company = _a.sent();
                            if (!company) {
                                throw new common_1.NotFoundException("Company with ID ".concat(id, " not found"));
                            }
                            return [2 /*return*/, company];
                    }
                });
            });
        };
        UserService_1.prototype.createCompanyWithDirector = function (email, password, name, companyName) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var company, user;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.company.create({
                                            data: { name: companyName, modules: { services: true, stock: true } },
                                        })];
                                    case 1:
                                        company = _a.sent();
                                        return [4 /*yield*/, this.createUser({
                                                email: email,
                                                password: password,
                                                name: name,
                                                roleName: 'director',
                                                companyId: company.id,
                                                confirmationToken: (0, uuid_1.v4)(),
                                            }, tx)];
                                    case 2:
                                        user = _a.sent();
                                        return [2 /*return*/, { user: user, company: company, confirmationToken: user.confirmationToken }];
                                }
                            });
                        }); })];
                });
            });
        };
        UserService_1.prototype.createEmployee = function (email, password, name, inviteToken) {
            return __awaiter(this, void 0, void 0, function () {
                var invitation;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.validateInviteToken(inviteToken)];
                        case 1:
                            invitation = _a.sent();
                            if (invitation.email !== email) {
                                throw new common_1.BadRequestException('Email does not match invitation');
                            }
                            return [2 /*return*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    var user;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.createUser({
                                                    email: email,
                                                    password: password,
                                                    name: name,
                                                    roleName: 'employee',
                                                    companyId: invitation.companyId,
                                                }, tx)];
                                            case 1:
                                                user = _a.sent();
                                                return [4 /*yield*/, tx.invitations.delete({ where: { id: invitation.id } })];
                                            case 2:
                                                _a.sent();
                                                return [2 /*return*/, { user: user, company: invitation.company, confirmationToken: user.confirmationToken }];
                                        }
                                    });
                                }); })];
                    }
                });
            });
        };
        UserService_1.prototype.createInvitation = function (email, companyId, creatorId) {
            return __awaiter(this, void 0, void 0, function () {
                var existingInvitation, token, expiresAt;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.checkUserExists(email)];
                        case 1:
                            if (_a.sent()) {
                                throw new common_1.BadRequestException('User with this email already exists');
                            }
                            return [4 /*yield*/, this.prisma.invitations.findFirst({
                                    where: { email: email, companyId: companyId },
                                })];
                        case 2:
                            existingInvitation = _a.sent();
                            if (existingInvitation) {
                                throw new common_1.BadRequestException('Invitation for this email already exists');
                            }
                            token = (0, uuid_1.v4)();
                            expiresAt = new Date(Date.now() + 7 * 24 * 3600000);
                            return [2 /*return*/, this.prisma.invitations.create({
                                    data: {
                                        token: token,
                                        email: email,
                                        companyId: companyId,
                                        creatorId: creatorId,
                                        expiresAt: expiresAt,
                                    },
                                })];
                    }
                });
            });
        };
        UserService_1.prototype.validateInviteToken = function (token) {
            return __awaiter(this, void 0, void 0, function () {
                var invitation;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.invitations.findUnique({
                                where: { token: token },
                                include: { company: true },
                            })];
                        case 1:
                            invitation = _a.sent();
                            if (!invitation || invitation.expiresAt < new Date()) {
                                throw new common_1.BadRequestException('Invalid or expired invitation token');
                            }
                            return [2 /*return*/, invitation];
                    }
                });
            });
        };
        UserService_1.prototype.confirmEmail = function (token) {
            return __awaiter(this, void 0, void 0, function () {
                var user, updatedUser;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findFirst({
                                where: { confirmationToken: token },
                            })];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                this.logger.warn("Invalid confirmation token: ".concat(token));
                                throw new common_1.BadRequestException('Invalid or expired token');
                            }
                            return [4 /*yield*/, this.prisma.user.update({
                                    where: { id: user.id },
                                    data: {
                                        isEmailConfirmed: true,
                                        confirmationToken: null,
                                    },
                                })];
                        case 2:
                            updatedUser = _a.sent();
                            this.logger.log("Email confirmed for user: ".concat(updatedUser.email));
                            return [2 /*return*/, { message: 'Email confirmed successfully' }];
                    }
                });
            });
        };
        return UserService_1;
    }());
    __setFunctionName(_classThis, "UserService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UserService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UserService = _classThis;
}();
exports.UserService = UserService;
