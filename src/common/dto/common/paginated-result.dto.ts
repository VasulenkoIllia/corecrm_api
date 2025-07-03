import { IsArray, IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// DTO for paginated API responses
export class PaginatedResultDTO<T = unknown> {
  @ApiProperty({ example: [{ id: 1, name: 'John' }], description: 'Array of items on the current page', isArray: true })
  @IsArray()
  items: T[];

  @ApiProperty({ example: 100, description: 'Total number of items' })
  @IsInt()
  @IsPositive()
  total: number;

  @ApiProperty({ example: 1, description: 'Current page number' })
  @IsInt()
  @IsPositive()
  page: number;

  @ApiProperty({ example: 10, description: 'Number of items per page' })
  @IsInt()
  @IsPositive()
  pageSize: number;
}
