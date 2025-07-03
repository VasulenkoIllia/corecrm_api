import { IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export interface UserWithRole {
  id: number;
  email: string;
  name: string;
  role: { name: string } | null;
}

export class UserResponseDTO {
  @ApiProperty({ example: 1, description: 'Unique identifier of the user' })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Email address of the user' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MinLength(5)
  @MaxLength(128)
  email: string;

  @ApiProperty({ example: 'ADMIN', description: 'Role of the user' })
  @IsString()
  @IsNotEmpty()
  role: string;
}
