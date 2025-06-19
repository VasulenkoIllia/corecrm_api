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
exports.AuthService = void 0;
var common_1 = require("@nestjs/common");
var bcrypt = require("bcrypt");
var uuid_1 = require("uuid");
var AuthService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AuthService = _classThis = /** @class */ (function () {
        function AuthService_1(userService, jwtService, configService, prisma, mailService, redisService) {
            this.userService = userService;
            this.jwtService = jwtService;
            this.configService = configService;
            this.prisma = prisma;
            this.mailService = mailService;
            this.redisService = redisService;
            this.logger = new common_1.Logger(AuthService.name);
        }
        AuthService_1.prototype.registerCompany = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var email, password, name, companyName, _a, user, company, confirmationToken;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            email = dto.email, password = dto.password, name = dto.name, companyName = dto.companyName;
                            return [4 /*yield*/, this.userService.createCompanyWithDirector(email, password, name, companyName)];
                        case 1:
                            _a = _b.sent(), user = _a.user, company = _a.company, confirmationToken = _a.confirmationToken;
                            return [4 /*yield*/, this.mailService.sendConfirmationEmail(email, confirmationToken)];
                        case 2:
                            _b.sent();
                            this.logger.log("Company ".concat(companyName, " and director ").concat(email, " created"));
                            return [2 /*return*/, { message: 'Company registered, please confirm your email' }];
                    }
                });
            });
        };
        AuthService_1.prototype.registerEmployee = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var email, password, name, inviteToken, _a, user, company, confirmationToken;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            email = dto.email, password = dto.password, name = dto.name, inviteToken = dto.inviteToken;
                            return [4 /*yield*/, this.userService.createEmployee(email, password, name, inviteToken)];
                        case 1:
                            _a = _b.sent(), user = _a.user, company = _a.company, confirmationToken = _a.confirmationToken;
                            return [4 /*yield*/, this.mailService.sendConfirmationEmail(email, confirmationToken)];
                        case 2:
                            _b.sent();
                            this.logger.log("Employee ".concat(email, " registered for company ").concat(company.id));
                            return [2 /*return*/, { message: 'Employee registered, please confirm your email' }];
                    }
                });
            });
        };
        AuthService_1.prototype.signIn = function (email, password) {
            return __awaiter(this, void 0, void 0, function () {
                var user, isPasswordValid, companyId, companyUser, payload, jwtSecret, jwtExpiresIn, jwtRefreshExpiresIn, accessToken, refreshToken, error_1;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 9, , 10]);
                            return [4 /*yield*/, this.userService.findByEmailForAuth(email)];
                        case 1:
                            user = _d.sent();
                            if (!user || !user.isEmailConfirmed) {
                                this.logger.warn("Login attempt failed: ".concat(email, " not found or email not confirmed"));
                                throw new common_1.UnauthorizedException('Invalid credentials or email not confirmed');
                            }
                            return [4 /*yield*/, bcrypt.compare(password, user.password)];
                        case 2:
                            isPasswordValid = _d.sent();
                            if (!isPasswordValid) {
                                this.logger.warn("Login attempt failed: Invalid password for ".concat(email));
                                throw new common_1.UnauthorizedException('Invalid credentials');
                            }
                            companyId = void 0;
                            if (!(((_a = user.role) === null || _a === void 0 ? void 0 : _a.name) !== 'superadmin')) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.userService.findCompanyUser(user.id)];
                        case 3:
                            companyUser = _d.sent();
                            companyId = companyUser.companyId;
                            _d.label = 4;
                        case 4:
                            payload = {
                                id: user.id,
                                email: user.email,
                                role: (_c = (_b = user.role) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : 'employee',
                                companyId: companyId,
                            };
                            jwtSecret = this.configService.get('JWT_SECRET');
                            if (!jwtSecret) {
                                this.logger.error('JWT_SECRET is not defined');
                                throw new Error('JWT_SECRET is not configured');
                            }
                            jwtExpiresIn = this.configService.get('JWT_EXPIRES_IN', '1h');
                            jwtRefreshExpiresIn = this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d');
                            return [4 /*yield*/, this.jwtService.signAsync(payload, {
                                    secret: jwtSecret,
                                    expiresIn: jwtExpiresIn,
                                })];
                        case 5:
                            accessToken = _d.sent();
                            return [4 /*yield*/, this.jwtService.signAsync(payload, {
                                    secret: jwtSecret,
                                    expiresIn: jwtRefreshExpiresIn,
                                })];
                        case 6:
                            refreshToken = _d.sent();
                            return [4 /*yield*/, this.redisService.set("session:".concat(user.id), accessToken, 3600)];
                        case 7:
                            _d.sent();
                            return [4 /*yield*/, this.redisService.set("refresh:".concat(user.id), refreshToken, 7 * 24 * 3600)];
                        case 8:
                            _d.sent();
                            this.logger.log("User ".concat(email, " signed in successfully"));
                            return [2 /*return*/, { accessToken: accessToken, refreshToken: refreshToken }];
                        case 9:
                            error_1 = _d.sent();
                            this.logger.error("Sign-in failed for ".concat(email, ": ").concat(error_1.message));
                            throw error_1 instanceof common_1.UnauthorizedException ? error_1 : new common_1.UnauthorizedException('Authentication failed');
                        case 10: return [2 /*return*/];
                    }
                });
            });
        };
        AuthService_1.prototype.getMe = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, this.userService.findById(userId)];
                        case 1:
                            user = _d.sent();
                            if (!user) {
                                this.logger.warn("User with ID ".concat(userId, " not found"));
                                throw new common_1.UnauthorizedException('User not found');
                            }
                            return [2 /*return*/, {
                                    id: user.id,
                                    email: user.email,
                                    name: user.name,
                                    role: (_b = (_a = user.role) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : 'employee',
                                    company: (_c = user.companies[0]) === null || _c === void 0 ? void 0 : _c.company,
                                }];
                    }
                });
            });
        };
        AuthService_1.prototype.createInvite = function (dto, directorId) {
            return __awaiter(this, void 0, void 0, function () {
                var email, companyId, companyExists, director, invitation, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.log("Entering createInvite with directorId: ".concat(directorId));
                            this.logger.log("Invite DTO: ".concat(JSON.stringify(dto)));
                            email = dto.email, companyId = dto.companyId;
                            this.logger.log("Creating invitation for email: ".concat(email, ", companyId: ").concat(companyId, ", type: ").concat(typeof companyId));
                            if (!Number.isInteger(companyId) || companyId <= 0) {
                                this.logger.warn("Invalid companyId: ".concat(companyId));
                                throw new common_1.BadRequestException('companyId must be a positive integer');
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 6, , 7]);
                            this.logger.log("Checking company existence for ID ".concat(companyId));
                            return [4 /*yield*/, this.prisma.company.findUnique({
                                    where: { id: companyId },
                                })];
                        case 2:
                            companyExists = _a.sent();
                            if (!companyExists) {
                                this.logger.warn("Company ".concat(companyId, " not found"));
                                throw new common_1.NotFoundException('Company not found');
                            }
                            this.logger.log("Fetching director with ID ".concat(directorId));
                            return [4 /*yield*/, this.prisma.user.findUnique({
                                    where: { id: directorId },
                                    include: {
                                        role: true,
                                        companies: { where: { companyId: companyId }, include: { company: true } },
                                    },
                                })];
                        case 3:
                            director = _a.sent();
                            this.logger.log("Director data: ".concat(JSON.stringify(director)));
                            if (!director) {
                                this.logger.warn("User ".concat(directorId, " not found"));
                                throw new common_1.UnauthorizedException('User not found');
                            }
                            if (!director.role || director.role.name !== 'director') {
                                this.logger.warn("User ".concat(directorId, " is not a director"));
                                throw new common_1.UnauthorizedException('Only directors can create invitations');
                            }
                            if (!director.companies.length) {
                                this.logger.warn("User ".concat(directorId, " not associated with company ").concat(companyId));
                                throw new common_1.UnauthorizedException('User not associated with the company');
                            }
                            return [4 /*yield*/, this.userService.createInvitation(email, companyId, directorId)];
                        case 4:
                            invitation = _a.sent();
                            return [4 /*yield*/, this.mailService.sendInvitationEmail(email, invitation.token, companyExists.name)];
                        case 5:
                            _a.sent();
                            this.logger.log("Invitation created for ".concat(email, " by director ").concat(directorId));
                            return [2 /*return*/, { message: 'Invitation created', token: invitation.token }];
                        case 6:
                            error_2 = _a.sent();
                            this.logger.error("Failed to create invitation: ".concat(error_2.message, ", stack: ").concat(error_2.stack));
                            throw error_2;
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        AuthService_1.prototype.validateInvite = function (token) {
            return __awaiter(this, void 0, void 0, function () {
                var invitation;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.userService.validateInviteToken(token)];
                        case 1:
                            invitation = _a.sent();
                            this.logger.log("Invitation token ".concat(token, " validated successfully"));
                            return [2 /*return*/, { email: invitation.email, company: invitation.company }];
                    }
                });
            });
        };
        AuthService_1.prototype.validateToken = function (token) {
            return __awaiter(this, void 0, void 0, function () {
                var jwtSecret, payload, session, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            jwtSecret = this.configService.get('JWT_SECRET');
                            if (!jwtSecret) {
                                this.logger.error('JWT_SECRET is not defined');
                                throw new Error('JWT_SECRET is not configured');
                            }
                            return [4 /*yield*/, this.jwtService.verifyAsync(token, {
                                    secret: jwtSecret,
                                })];
                        case 1:
                            payload = _a.sent();
                            return [4 /*yield*/, this.redisService.get("session:".concat(payload.id))];
                        case 2:
                            session = _a.sent();
                            if (!session || session !== token) {
                                this.logger.warn("Invalid session token for user ".concat(payload.email));
                                throw new common_1.UnauthorizedException('Invalid session');
                            }
                            this.logger.log("Token validated successfully for user: ".concat(payload.email));
                            return [2 /*return*/, payload];
                        case 3:
                            error_3 = _a.sent();
                            this.logger.warn("Token validation failed: ".concat(error_3.message));
                            throw error_3;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        AuthService_1.prototype.refreshToken = function (refreshToken) {
            return __awaiter(this, void 0, void 0, function () {
                var jwtSecret, payload, user, storedRefreshToken, companyId, companyUser, newPayload, jwtExpiresIn, jwtRefreshExpiresIn, accessToken, newRefreshToken, error_4;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 10, , 11]);
                            jwtSecret = this.configService.get('JWT_SECRET');
                            if (!jwtSecret) {
                                this.logger.error('JWT_SECRET is not defined');
                                throw new Error('JWT_SECRET is not configured');
                            }
                            return [4 /*yield*/, this.jwtService.verifyAsync(refreshToken, {
                                    secret: jwtSecret,
                                })];
                        case 1:
                            payload = _d.sent();
                            return [4 /*yield*/, this.userService.findById(payload.id)];
                        case 2:
                            user = _d.sent();
                            if (!user) {
                                this.logger.warn("User with ID ".concat(payload.id, " not found"));
                                throw new common_1.UnauthorizedException('Invalid user');
                            }
                            return [4 /*yield*/, this.redisService.get("refresh:".concat(user.id))];
                        case 3:
                            storedRefreshToken = _d.sent();
                            if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
                                this.logger.warn("Invalid refresh token for user ".concat(user.email));
                                throw new common_1.UnauthorizedException('Invalid refresh token');
                            }
                            companyId = void 0;
                            if (!(((_a = user.role) === null || _a === void 0 ? void 0 : _a.name) !== 'superadmin')) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.userService.findCompanyUser(user.id)];
                        case 4:
                            companyUser = _d.sent();
                            companyId = companyUser.companyId;
                            _d.label = 5;
                        case 5:
                            newPayload = {
                                id: user.id,
                                email: user.email,
                                role: (_c = (_b = user.role) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : 'employee',
                                companyId: companyId,
                            };
                            jwtExpiresIn = this.configService.get('JWT_EXPIRES_IN', '1h');
                            jwtRefreshExpiresIn = this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d');
                            return [4 /*yield*/, this.jwtService.signAsync(newPayload, {
                                    secret: jwtSecret,
                                    expiresIn: jwtExpiresIn,
                                })];
                        case 6:
                            accessToken = _d.sent();
                            return [4 /*yield*/, this.jwtService.signAsync(newPayload, {
                                    secret: jwtSecret,
                                    expiresIn: jwtRefreshExpiresIn,
                                })];
                        case 7:
                            newRefreshToken = _d.sent();
                            return [4 /*yield*/, this.redisService.set("session:".concat(user.id), accessToken, 3600)];
                        case 8:
                            _d.sent();
                            return [4 /*yield*/, this.redisService.set("refresh:".concat(user.id), newRefreshToken, 7 * 24 * 3600)];
                        case 9:
                            _d.sent();
                            this.logger.log("Token refreshed successfully for user: ".concat(user.email));
                            return [2 /*return*/, { accessToken: accessToken, refreshToken: newRefreshToken }];
                        case 10:
                            error_4 = _d.sent();
                            this.logger.error("Refresh token failed: ".concat(error_4.message));
                            throw new common_1.UnauthorizedException('Token refresh failed');
                        case 11: return [2 /*return*/];
                    }
                });
            });
        };
        AuthService_1.prototype.confirmEmail = function (token) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.userService.confirmEmail(token)];
                });
            });
        };
        AuthService_1.prototype.requestPasswordReset = function (email) {
            return __awaiter(this, void 0, void 0, function () {
                var user, resetToken, resetTokenExpires;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.log("Initiating password reset for email: ".concat(email));
                            return [4 /*yield*/, this.prisma.user.findUnique({ where: { email: email } })];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                this.logger.warn("User with email ".concat(email, " not found"));
                                throw new common_1.NotFoundException('User not found');
                            }
                            resetToken = (0, uuid_1.v4)();
                            resetTokenExpires = new Date(Date.now() + 3600 * 1000);
                            return [4 /*yield*/, this.prisma.user.update({
                                    where: { email: email },
                                    data: { resetToken: resetToken, resetTokenExpires: resetTokenExpires },
                                })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.mailService.sendPasswordResetEmail(email, resetToken)];
                        case 3:
                            _a.sent();
                            this.logger.log("Password reset email sent to ".concat(email));
                            return [2 /*return*/, { message: 'Password reset email sent successfully' }];
                    }
                });
            });
        };
        AuthService_1.prototype.resetPassword = function (token, newPassword) {
            return __awaiter(this, void 0, void 0, function () {
                var user, hashedPassword;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.log("Attempting password reset with token: ".concat(token));
                            return [4 /*yield*/, this.prisma.user.findFirst({
                                    where: {
                                        resetToken: token,
                                        resetTokenExpires: { gt: new Date() },
                                    },
                                })];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                this.logger.warn("Invalid or expired reset token: ".concat(token));
                                throw new common_1.BadRequestException('Invalid or expired token');
                            }
                            return [4 /*yield*/, bcrypt.hash(newPassword, 10)];
                        case 2:
                            hashedPassword = _a.sent();
                            return [4 /*yield*/, this.prisma.user.update({
                                    where: { id: user.id },
                                    data: {
                                        password: hashedPassword,
                                        resetToken: null,
                                        resetTokenExpires: null,
                                    },
                                })];
                        case 3:
                            _a.sent();
                            this.logger.log("Password reset successfully for user ID: ".concat(user.id));
                            return [2 /*return*/, { message: 'Password reset successfully' }];
                    }
                });
            });
        };
        return AuthService_1;
    }());
    __setFunctionName(_classThis, "AuthService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthService = _classThis;
}();
exports.AuthService = AuthService;
