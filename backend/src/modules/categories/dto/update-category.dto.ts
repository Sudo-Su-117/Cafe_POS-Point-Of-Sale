import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiProperty({ example: 'Coffee', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Hot coffee beverages', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
