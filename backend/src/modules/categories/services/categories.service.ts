import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { ResourceNotFoundException } from '../../../common/exceptions/custom.exception';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      include: { products: true },
    });
  }

  async findById(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!category) {
      throw new ResourceNotFoundException('Category');
    }

    return category;
  }

  async create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({ where: { id } });

    if (!category) {
      throw new ResourceNotFoundException('Category');
    }

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async delete(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });

    if (!category) {
      throw new ResourceNotFoundException('Category');
    }

    return this.prisma.category.delete({
      where: { id },
    });
  }
}
