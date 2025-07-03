import { IsArray, IsBoolean, IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class PermissionDto {
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

export class RoleWithPermissionsDto {
  @ApiProperty({ example: 1, description: 'Unique identifier of the role' })
  @IsInt()
  id: number;

  @ApiProperty({ example: 'Manager', description: 'Name of the role' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Manages company operations', description: 'Description of the role', required: false })
  @IsString()
  description?: string;

  @ApiProperty({
    example: [{ module: 'clients', read: true, create: true, update: true, delete: false }],
    description: 'Array of permissions for the role',
    isArray: true,
  })
  @IsArray()
  permissions: PermissionDto[];
}

export class GetCompanyRolesResponseDto {
  @ApiProperty({
    example: [{ id: 1, name: 'Manager', description: 'Manages company operations', permissions: [{ module: 'clients', read: true, create: true, update: true, delete: false }] }],
    description: 'Array of roles with their permissions',
    isArray: true,
  })
  @IsArray()
  roles: RoleWithPermissionsDto[];
}
