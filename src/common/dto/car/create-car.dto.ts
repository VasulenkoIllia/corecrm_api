import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCarDto {
  @ApiProperty({ example: '1HGCM82633A123456', description: 'Унікальний VIN-код автомобіля' })
  @IsString()
  vin: string;

  @ApiProperty({ example: 'Toyota', description: 'Марка автомобіля' })
  @IsString()
  make: string;

  @ApiProperty({ example: 'Camry', description: 'Модель автомобіля' })
  @IsString()
  model: string;

  @ApiProperty({ example: 2020, description: 'Рік випуску автомобіля' })
  @IsInt()
  year: number;

  @ApiProperty({ example: 'Сріблястий', description: 'Колір автомобіля', required: false })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({ example: 'АВ1234ВІ', description: 'Номерний знак автомобіля', required: false })
  @IsOptional()
  @IsString()
  licensePlate?: string;

  @ApiProperty({ example: 'Регулярне обслуговування', description: 'Додаткові нотатки', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
