import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Param, ParseIntPipe, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AccessControlEndpoint } from '../../common/decorators/access-control-endpoint.decorator';
import { CatchError } from '../../common/decorators/catch-error.decorator';
import { User } from '../../common/decorators/user.decorator';
import { IJwtPayload } from '../../common/interfaces/common/jwt-payload.interface';
import { CarsService } from './cars.service';
import { CreateCarDto } from '../../common/dto/car/create-car.dto';
import { CarResponseDto } from '../../common/dto/car/car-response.dto'; // Припускаю, що такий DTO існує

// Константи для модуля та дій
const MODULE_NAME = 'cars';
const ACTIONS = {
  READ: 'read' as const,
  CREATE: 'create' as const,
};

/**
 * Контролер для управління автомобілями
 */
@ApiTags('Cars')
@Controller('cars')
export class CarsController {
  private readonly logger = new Logger(CarsController.name);

  constructor(private readonly carsService: CarsService) {}

  /**
   * Отримує деталі автомобіля за ідентифікатором
   */
  @Get(':id')
  @AccessControlEndpoint(':id', { module: MODULE_NAME, action: ACTIONS.READ })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get car details by ID' })
  @ApiOkResponse({
    status: 200,
    description: 'Car details retrieved successfully',
    type: CarResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Car not found' })
  @ApiForbiddenResponse({ description: 'Access denied' })
  @ApiParam({ name: 'id', description: 'Car ID', type: Number })
  @CatchError('Fetching car details')
  async getCar(@Param('id', ParseIntPipe) id: number, @User() user: IJwtPayload) {
    this.logger.log({
      message: 'Fetching car details',
      carId: id,
      companyId: user.companyId,
      userId: user.id,
      method: 'getCar',
    });
    return this.carsService.getCar(id, user.companyId, user.id);
  }

  /**
   * Додає автомобіль до клієнта
   */
  @Post(':id/cars')
  @AccessControlEndpoint(':id/cars', { module: MODULE_NAME, action: ACTIONS.CREATE })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add car to client' })
  @ApiOkResponse({
    status: 201,
    description: 'Car added successfully',
    type: CarResponseDto, // Припускаю, що DTO існує
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiNotFoundResponse({ description: 'Client not found' })
  @ApiForbiddenResponse({ description: 'Access denied' })
  @ApiParam({ name: 'id', description: 'Client ID', type: Number })
  @ApiBody({
    type: CreateCarDto,
    examples: {
      example1: {
        summary: 'Example of adding a car',
        value: {
          vin: '1HGCM82633A123456',
          make: 'Toyota',
          model: 'Camry',
          year: 2020,
          color: 'Silver',
          licensePlate: 'AB1234BI',
          notes: 'Regular maintenance',
        },
      },
    },
  })
  @CatchError('Adding car to client')
  async addCar(
    @Param('id', ParseIntPipe) clientId: number,
    @Body() createCarDto: CreateCarDto,
    @User() user: IJwtPayload,
  ) {
    this.logger.log({
      message: 'Adding car to client',
      clientId,
      companyId: user.companyId,
      userId: user.id,
      method: 'addCar',
    });
    return this.carsService.addCar(clientId, createCarDto, user.companyId, user.id);
  }

  /**
   * Отримує список автомобілів клієнта
   */
  @Get(':id/cars')
  @AccessControlEndpoint(':id/cars', { module: MODULE_NAME, action: ACTIONS.READ })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get list of client cars' })
  @ApiOkResponse({
    status: 200,
    description: 'List of client cars retrieved successfully',
    type: [CarResponseDto], // Припускаю, що DTO існує
  })
  @ApiNotFoundResponse({ description: 'Client not found' })
  @ApiForbiddenResponse({ description: 'Access denied' })
  @ApiParam({ name: 'id', description: 'Client ID', type: Number })
  @CatchError('Fetching client cars')
  async getClientCars(@Param('id', ParseIntPipe) clientId: number, @User() user: IJwtPayload) {
    this.logger.log({
      message: 'Fetching client cars',
      clientId,
      companyId: user.companyId,
      userId: user.id,
      method: 'getClientCars',
    });
    return this.carsService.getClientCars(clientId, user.companyId, user.id);
  }
}
