import { ArrayNotEmpty, IsArray, IsBoolean, IsInt, IsString } from 'class-validator';

export class PermissionDto {
  @IsString()
  module: string;

  @IsBoolean()
  read: boolean;

  @IsBoolean()
  create: boolean;

  @IsBoolean()
  update: boolean;

  @IsBoolean()
  delete: boolean;
}

export class SetRolePermissionsDto {
  @IsInt()
  roleId: number;

  @IsArray()
  @ArrayNotEmpty()
  permissions: PermissionDto[];
}
