import { IsBoolean, IsString } from 'class-validator';

class PermissionDto {
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
