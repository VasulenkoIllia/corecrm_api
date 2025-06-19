import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateModulesDto {
  @ApiProperty({ example: true, description: 'Статус модуля clients', required: false })
  @IsOptional()
  @IsBoolean()
  clients?: boolean;

  @ApiProperty({ example: false, description: 'Статус модуля cars', required: false })
  @IsOptional()
  @IsBoolean()
  cars?: boolean;

  @ApiProperty({ example: true, description: 'Статус модуля invoices', required: false })
  @IsOptional()
  @IsBoolean()
  invoices?: boolean;

  @ApiProperty({ example: false, description: 'Статус модуля reports', required: false })
  @IsOptional()
  @IsBoolean()
  reports?: boolean;
}
