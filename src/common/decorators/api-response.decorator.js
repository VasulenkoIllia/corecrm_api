"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiSearchParameter = exports.ApiPaginatedResponse = exports.ApiArrayResponse = exports.ApiResponse = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var paginated_result_dto_1 = require("../dto/common/paginated-result.dto");
var search_parameter_dto_1 = require("../dto/common/search-parameter.dto");
// Список базових типів JavaScript, які не потребують $ref у Swagger
var valueTypes = ['Boolean', 'Number', 'String', 'BigInt', 'Symbol'];
// Декоратор для документування API-відповіді з одним об’єктом
var ApiResponse = function (dataDto) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(dataDto), (0, swagger_1.ApiOkResponse)({
        description: "Successful response with a single ".concat(dataDto.name),
        schema: {
            type: 'object',
            properties: {
                data: valueTypes.includes(dataDto.name)
                    ? { type: dataDto.name.toLowerCase() }
                    : { $ref: (0, swagger_1.getSchemaPath)(dataDto) },
            },
        },
    }));
};
exports.ApiResponse = ApiResponse;
// Декоратор для документування API-відповіді з масивом об’єктів
var ApiArrayResponse = function (dataDto) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(dataDto), (0, swagger_1.ApiOkResponse)({
        description: "Successful response with an array of ".concat(dataDto.name),
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: valueTypes.includes(dataDto.name)
                        ? { type: dataDto.name.toLowerCase() }
                        : { $ref: (0, swagger_1.getSchemaPath)(dataDto) },
                },
            },
        },
    }));
};
exports.ApiArrayResponse = ApiArrayResponse;
// Декоратор для документування API-відповіді з пагінованими результатами
var ApiPaginatedResponse = function (dataDto) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(paginated_result_dto_1.PaginatedResultDTO, dataDto), (0, swagger_1.ApiOkResponse)({
        description: "Successful paginated response with ".concat(dataDto.name, " items"),
        schema: {
            type: 'object',
            properties: {
                data: {
                    allOf: [
                        { $ref: (0, swagger_1.getSchemaPath)(paginated_result_dto_1.PaginatedResultDTO) },
                        {
                            properties: {
                                items: {
                                    type: 'array',
                                    items: valueTypes.includes(dataDto.name)
                                        ? { type: dataDto.name.toLowerCase() }
                                        : { $ref: (0, swagger_1.getSchemaPath)(dataDto) },
                                },
                            },
                        },
                    ],
                },
            },
        },
    }));
};
exports.ApiPaginatedResponse = ApiPaginatedResponse;
// Декоратор для документування параметрів пошуку
var ApiSearchParameter = function (dataDto) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(search_parameter_dto_1.SearchParameterDTO, dataDto), (0, swagger_1.ApiOkResponse)({
        description: "Search parameters for ".concat(dataDto.name),
        schema: {
            allOf: [
                { $ref: (0, swagger_1.getSchemaPath)(search_parameter_dto_1.SearchParameterDTO) },
                {
                    properties: {
                        searchBy: {
                            type: 'array',
                            items: valueTypes.includes(dataDto.name)
                                ? { type: dataDto.name.toLowerCase() }
                                : { $ref: (0, swagger_1.getSchemaPath)(dataDto) },
                        },
                    },
                },
            ],
        },
    }));
};
exports.ApiSearchParameter = ApiSearchParameter;
