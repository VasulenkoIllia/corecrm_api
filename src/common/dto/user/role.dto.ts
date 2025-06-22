import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';
import { PermissionDto } from '../company/set-role-permissions.dto';


export class RoleDto {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  companyId?: number;

  @IsOptional()
  @IsArray()
  permissions?: PermissionDto[];
}
