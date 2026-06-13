import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePromotionDto } from '../dto/create-promotion.dto';
import { UpdatePromotionDto } from '../dto/update-promotion.dto';
import { ResourceNotFoundException } from '../../../common/exceptions/custom.exception';

@Injectable()
export class PromotionsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.promotion.findMany();
  }

  async findById(id: string) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
    });

    if (!promotion) {
      throw new ResourceNotFoundException('Promotion');
    }

    return promotion;
  }

  async create(createPromotionDto: CreatePromotionDto) {
    return this.prisma.promotion.create({
      data: {
        name: createPromotionDto.name,
        description: createPromotionDto.description,
        type: String(createPromotionDto.type) as any,
        value: createPromotionDto.value,
        startDate: createPromotionDto.startDate,
        endDate: createPromotionDto.endDate,
        isActive: createPromotionDto.isActive ?? true,
      },
    });
  }

  async update(id: string, updatePromotionDto: UpdatePromotionDto) {
    const promotion = await this.prisma.promotion.findUnique({ where: { id } });

    if (!promotion) {
      throw new ResourceNotFoundException('Promotion');
    }

    const dataToUpdate: any = {};
    if (updatePromotionDto.name) dataToUpdate.name = updatePromotionDto.name;
    if (updatePromotionDto.description) dataToUpdate.description = updatePromotionDto.description;
    if (updatePromotionDto.type) dataToUpdate.type = updatePromotionDto.type;
    if (updatePromotionDto.value !== undefined) dataToUpdate.value = updatePromotionDto.value;
    if (updatePromotionDto.startDate) dataToUpdate.startDate = updatePromotionDto.startDate;
    if (updatePromotionDto.endDate) dataToUpdate.endDate = updatePromotionDto.endDate;
    if (updatePromotionDto.isActive !== undefined) dataToUpdate.isActive = updatePromotionDto.isActive;

    return this.prisma.promotion.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async delete(id: string) {
    const promotion = await this.prisma.promotion.findUnique({ where: { id } });

    if (!promotion) {
      throw new ResourceNotFoundException('Promotion');
    }

    return this.prisma.promotion.delete({
      where: { id },
    });
  }
}
