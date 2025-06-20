import { Body, Controller, HttpCode, HttpStatus, Logger, Param, RequestMethod, SetMetadata } from '@nestjs/common';
import { CarsService } from './cars.service';
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { SecureEndpoint } from '../../common/decorators/secure-endpoint.decorator';
import { CatchError } from '../../common/decorators/catch-error.decorator';
import { User } from '../../common/decorators/user.decorator';
import { IJwtPayload } from '../../common/interfaces/common/jwt-payload.interface';
import { CreateCarDto } from '../../common/dto/car/create-car.dto';

@ApiTags('cars')
@Controller('cars')
@SetMetadata('module', 'cars')
export class CarsController {
  private readonly logger = new Logger(CarsController.name);

  constructor(private readonly carsService: CarsService) {}

  // @SecureEndpoint('vin-decode', RequestMethod.POST)
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Декодувати VIN (mock для dev)' })
  // @ApiOkResponse({
  //   status: 200,
  //   description: 'Декодовані дані автомобіля',
  //   schema: { properties: { data: { type: 'object' } } }
  // })
  // @ApiBody({
  //   type: VinDecodeDto,
  //   examples: {
  //     example1: {
  //       summary: 'Приклад декодування VIN',
  //       value: { vin: '1HGCM82633A123456' },
  //     },
  //   },
  // })
  // @CatchError('Декодування VIN')
  // async vinDecode(@Body() vinDecodeDto: VinDecodeDto, @User() user: IJwtPayload) {
  //   console.log(111);
  //   return this.carsService.vinDecode(vinDecodeDto, user.companyId, user.id);
  // }

  @SecureEndpoint(':id', RequestMethod.GET)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Отримати деталі автомобіля' })
  @ApiOkResponse({
    status: 200,
    description: 'Деталі автомобіля',
    schema: { properties: { data: { type: 'object' } } }
  })
  @ApiParam({ name: 'id', description: 'ID автомобіля', example: 1 })
  @CatchError('Отримання деталей автомобіля')
  async getCar(@Param('id') id: string, @User() user: IJwtPayload) {
    console.log(111);
    return this.carsService.getCar(+id, user.companyId, user.id);
  }
}

@ApiTags('cars')
@Controller('cars')
@SetMetadata('module', 'cars')
export class ClientsCarsController {
  private readonly logger = new Logger(ClientsCarsController.name);

  constructor(private readonly carsService: CarsService) {}

  @SecureEndpoint(':id/cars', RequestMethod.POST)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Додати автомобіль до клієнта' })
  @ApiOkResponse({
    status: 201,
    description: 'Автомобіль додано',
    schema: { properties: { message: { type: 'string' }, data: { type: 'object' } } }
  })
  @ApiParam({ name: 'id', description: 'ID клієнта', example: 1 })
  @ApiBody({
    type: CreateCarDto,
    examples: {
      example1: {
        summary: 'Приклад створення автомобіля',
        value: {
          vin: '1HGCM82633A123456',
          make: 'Toyota',
          model: 'Camry',
          year: 2020,
          color: 'Сріблястий',
          licensePlate: 'АВ1234ВІ',
          notes: 'Регулярне обслуговування',
        },
      },
    },
  })
  @CatchError('Додавання автомобіля до клієнта')
  async addCar(@Param('id') clientId: string, @Body() createCarDto: CreateCarDto, @User() user: IJwtPayload) {
    console.log(111);
    return this.carsService.addCar(+clientId, createCarDto, user.companyId, user.id);
  }

  @SecureEndpoint(':id/cars', RequestMethod.GET)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Отримати список автомобілів клієнта' })
  @ApiOkResponse({
    status: 200,
    description: 'Список автомобілів клієнта',
    schema: { properties: { data: { type: 'array', items: { type: 'object' } } } }
  })
  @ApiParam({ name: 'id', description: 'ID клієнта', example: 1 })
  @CatchError('Отримання автомобілів клієнта')
  async getClientCars(@Param('id') clientId: string, @User() user: IJwtPayload) {
    console.log(111);
    return this.carsService.getClientCars(+clientId, user.companyId, user.id);
  }
}
