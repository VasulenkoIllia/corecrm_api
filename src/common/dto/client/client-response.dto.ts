import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ClientResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier of the client' })
  @IsInt()
  id: number;

  @ApiProperty({ example: 'John', description: 'First name of the client' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Petrenko', description: 'Last name of the client' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: '+380671234567', description: 'Phone number of the client', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'john.petrenko@example.com', description: 'Email address of the client', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ example: 1, description: 'ID of the company the client belongs to' })
  @IsInt()
  companyId: number;

  constructor(data: { id: number; firstName: string; lastName: string; phone?: string; email?: string; companyId: number }) {
    this.id = data.id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.phone = data.phone;
    this.email = data.email;
    this.companyId = data.companyId;
  }
}
