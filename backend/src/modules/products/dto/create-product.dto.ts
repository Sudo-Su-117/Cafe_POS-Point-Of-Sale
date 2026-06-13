import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Espresso' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Strong black coffee' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 150 })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ example: 'coffee' })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({ example: 50, required: false })
  @IsOptional()
  @IsNumber()
  stock?: number;
}
