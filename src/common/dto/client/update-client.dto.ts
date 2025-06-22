import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateClientDto {
  @ApiProperty({ example: 'Іван', description: 'Ім’я клієнта' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Петренко', description: 'Прізвище клієнта' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: '+380671234567', description: 'Номер телефону клієнта', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'ivan.petrenko@example.com', description: 'Електронна пошта клієнта', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;
}
