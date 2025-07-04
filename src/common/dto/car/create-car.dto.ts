import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCarDto {
  @ApiProperty({ example: '1HGCM82633A123456', description: 'Unique VIN code of the car' })
  @IsString()
  vin: string;

  @ApiProperty({ example: 'Toyota', description: 'Car make' })
  @IsString()
  make: string;

  @ApiProperty({ example: 'Camry', description: 'Car model' })
  @IsString()
  model: string;

  @ApiProperty({ example: 2020, description: 'Car manufacturing year' })
  @IsInt()
  year: number;

  @ApiProperty({ example: 'Silver', description: 'Car color', required: false })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({ example: 'AB1234BI', description: 'Car license plate', required: false })
  @IsOptional()
  @IsString()
  licensePlate?: string;

  @ApiProperty({ example: 'Regular maintenance', description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
