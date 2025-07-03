import { ApiProperty } from '@nestjs/swagger';

export class CarResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier of the car' })
  id: number;

  @ApiProperty({ example: '1HGCM82633A123456', description: 'Unique VIN code of the car' })
  vin: string;

  @ApiProperty({ example: 'Toyota', description: 'Car make' })
  make: string;

  @ApiProperty({ example: 'Camry', description: 'Car model' })
  model: string;

  @ApiProperty({ example: 2020, description: 'Car manufacturing year' })
  year: number;

  @ApiProperty({ example: 'Silver', description: 'Car color', required: false })
  color?: string;

  @ApiProperty({ example: 'AB1234BI', description: 'Car license plate', required: false })
  licensePlate?: string;

  @ApiProperty({ example: 'Regular maintenance', description: 'Additional notes', required: false })
  notes?: string;
}
