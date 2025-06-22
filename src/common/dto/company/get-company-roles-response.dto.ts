import { IsArray, IsInt, IsString } from 'class-validator';

class PermissionDto {
  @IsString()
  module: string;

  @IsInt()
  read: boolean;

  @IsInt()
  create: boolean;

  @IsInt()
  update: boolean;

  @IsInt()
  delete: boolean;
}

export class RoleWithPermissionsDto {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  @IsString()
  description?: string;

  @IsArray()
  permissions: PermissionDto[];
}

export class GetCompanyRolesResponseDto {
  @IsArray()
  roles: RoleWithPermissionsDto[];
}
