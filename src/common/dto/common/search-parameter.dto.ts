import { IsArray, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// DTO for API search parameters
export class SearchParameterDTO<T = unknown> {
  @ApiProperty({ example: ['name', 'email'], description: 'Fields to search by', required: false })
  @IsArray()
  @IsOptional()
  searchBy?: T[];

  @ApiProperty({ example: 'John', description: 'Search query string', required: false })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiProperty({ example: 1, description: 'Page number', required: false })
  @IsOptional()
  @IsInt()
  @IsPositive()
  page?: number;

  @ApiProperty({ example: 10, description: 'Number of items per page', required: false })
  @IsOptional()
  @IsInt()
  @IsPositive()
  pageSize?: number;
}
