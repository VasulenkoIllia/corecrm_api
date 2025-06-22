import { IsArray, IsEmail, IsInt, IsOptional, IsString } from 'class-validator';
import { RoleDto } from './role.dto'; // Імпорт RoleDto

class CompanyDto {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  @IsOptional()
  status: string;
}

export class UserMeResponseDto {
  @IsInt()
  id: number;

  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  role: string;

  @IsArray()
  companies: CompanyDto[];

  @IsArray()
  companyRoles: RoleDto[]; // Змінено з roles на companyRoles
}
