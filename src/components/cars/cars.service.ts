import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AccessControlService } from '../access-control/access-control.service';
import { CreateCarDto } from '../../common/dto/car/create-car.dto';


@Injectable()
export class CarsService {
  constructor(
    private prisma: PrismaService,
    // private vinDecoder: VinDecoderService,
    private accessControlService: AccessControlService,
  ) {}

  async addCar(clientId: number, createCarDto: CreateCarDto, companyId: number, userId: number) {
    await this.accessControlService.checkAccess(userId, companyId, { module: 'cars' });

    const client = await this.prisma.client.findUnique({
      where: { id: clientId, companyId },
    });

    if (!client) {
      throw new NotFoundException('Клієнт не знайдений');
    }

    const car = await this.prisma.car.create({
      data: {
        clientId,
        companyId,
        vin: createCarDto.vin,
        make: createCarDto.make,
        model: createCarDto.model,
        year: createCarDto.year,
        color: createCarDto.color,
        licensePlate: createCarDto.licensePlate,
        notes: createCarDto.notes,
      },
    });

    return { message: 'Автомобіль додано', data: car };
  }

  async getClientCars(clientId: number, companyId: number, userId: number) {
    await this.accessControlService.checkAccess(userId, companyId, { module: 'cars' });

    const cars = await this.prisma.car.findMany({
      where: { clientId, companyId },
    });

    return { data: cars };
  }

  async getCar(id: number, companyId: number, userId: number) {
    await this.accessControlService.checkAccess(userId, companyId, { module: 'cars' });

    const car = await this.prisma.car.findUnique({
      where: { id, companyId },
      include: { client: true },
    });

    if (!car) {
      throw new NotFoundException('Автомобіль не знайдений');
    }

    return { data: car };
  }

  // async vinDecode(vinDecodeDto: VinDecodeDto, companyId: number, userId: number) {
  //   await this.accessControlService.checkAccess(userId, companyId, { module: 'cars' });
  //   return { data: await this.vinDecoder.decodeVin(vinDecodeDto.vin) };
  // }
}
