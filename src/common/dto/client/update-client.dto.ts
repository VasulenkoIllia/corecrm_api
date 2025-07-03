import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateClientDto {
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
  @IsEmail()
  email?: string;
}
