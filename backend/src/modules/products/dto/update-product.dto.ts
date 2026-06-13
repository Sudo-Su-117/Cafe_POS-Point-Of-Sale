import { IsOptional, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiProperty({ example: 'Espresso', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Strong black coffee', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 150, required: false })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({ example: 'coffee', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ example: 50, required: false })
  @IsOptional()
  @IsNumber()
  stock?: number;
}
