import { ArrayNotEmpty, IsArray, IsBoolean, IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PermissionDto {
  @ApiProperty({ example: 'clients', description: 'Module name for permissions' })
  @IsString()
  module: string;

  @ApiProperty({ example: true, description: 'Permission to read data' })
  @IsBoolean()
  create: boolean;

  @ApiProperty({ example: true, description: 'Permission to create data' })
  @IsBoolean()
  delete: boolean;

  @ApiProperty({ example: true, description: 'Permission to delete data' })
  @IsBoolean()
  read: boolean;

  @ApiProperty({ example: true, description: 'Permission to update data' })
  @IsBoolean()
  update: boolean;
}

export class SetRolePermissionsDto {
  @ApiProperty({ example: 1, description: 'ID of the role' })
  @IsInt()
  roleId: number;

  @ApiProperty({
    example: [{ module: 'clients', read: true, create: true, update: true, delete: false }],
    description: 'Array of permissions for the role',
    isArray: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  permissions: PermissionDto[];
}
