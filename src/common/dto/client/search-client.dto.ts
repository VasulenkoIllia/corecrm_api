import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchClientDto {
  @ApiProperty({ example: 'John', description: 'Search query for client name, last name, phone, or email' })
  @IsString()
  query: string;
}
