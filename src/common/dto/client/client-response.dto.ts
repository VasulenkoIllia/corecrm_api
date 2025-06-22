import { IsInt, IsOptional, IsString } from 'class-validator';

export class ClientResponseDto {
  @IsInt()
  id: number;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;

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
