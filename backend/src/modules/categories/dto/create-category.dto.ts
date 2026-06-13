import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Coffee' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Hot coffee beverages', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
