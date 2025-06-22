import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateCompanyRoleDto {
  @IsInt()
  companyId: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
