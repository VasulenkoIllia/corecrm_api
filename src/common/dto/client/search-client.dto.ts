import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchClientDto {
  @ApiProperty({ example: 'Іван', description: 'Пошуковий запит для імені, прізвища, телефону або email клієнта' })
  @IsString()
  query: string;
}
