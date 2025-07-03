import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateModulesDto {
  @ApiProperty({ example: true, description: 'Activation status of the clients module', required: false })
  @IsOptional()
  @IsBoolean()
  cars?: boolean;

  @ApiProperty({ example: false, description: 'Activation status of the cars module', required: false })
  @IsOptional()
  @IsBoolean()
  clients?: boolean;

  @ApiProperty({ example: true, description: 'Activation status of the invoices module', required: false })
  @IsOptional()
  @IsBoolean()
  invoices?: boolean;

  @ApiProperty({ example: false, description: 'Activation status of the reports module', required: false })
  @IsOptional()
  @IsBoolean()
  reports?: boolean;
}
