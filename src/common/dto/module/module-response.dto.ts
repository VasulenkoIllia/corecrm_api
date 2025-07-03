import { ApiProperty } from '@nestjs/swagger';

export class ModuleResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier of the module' })
  id: number;

  @ApiProperty({ example: 'clients', description: 'Name of the module' })
  name: string;

  @ApiProperty({ example: true, description: 'Activation status of the module' })
  isActive: boolean;
}
