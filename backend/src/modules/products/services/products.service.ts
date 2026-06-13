import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ResourceNotFoundException } from '../../../common/exceptions/custom.exception';
import { PaginationDto } from '../../../common/dto/pagination.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take: limit,
      }),
      this.prisma.product.count(),
    ]);

    return {
      data: products,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new ResourceNotFoundException('Product');
    }

    return product;
  }

  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        categoryId: createProductDto.category,
        stock: createProductDto.stock || 0,
      },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new ResourceNotFoundException('Product');
    }

    const dataToUpdate: any = {};
    if (updateProductDto.name) dataToUpdate.name = updateProductDto.name;
    if (updateProductDto.description)
      dataToUpdate.description = updateProductDto.description;
    if (updateProductDto.price !== undefined)
      dataToUpdate.price = updateProductDto.price;
    if (updateProductDto.category)
      dataToUpdate.categoryId = updateProductDto.category;
    if (updateProductDto.stock !== undefined)
      dataToUpdate.stock = updateProductDto.stock;

    return this.prisma.product.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async delete(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new ResourceNotFoundException('Product');
    }

    return this.prisma.product.delete({
      where: { id },
    });
  }
}
