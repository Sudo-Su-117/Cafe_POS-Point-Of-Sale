import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DateRangeDto } from '../dto/date-range.dto';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getSalesReport(dateRange: DateRangeDto) {
    const { startDate, endDate } = this._parseDateRange(dateRange);

    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: { items: true, payment: true },
    });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => {
      const orderTotal = order.items.reduce(
        (itemSum, item) => itemSum + item.unitPrice * item.quantity,
        0,
      );
      return sum + orderTotal;
    }, 0);

    return {
      period: { startDate, endDate },
      totalOrders,
      totalRevenue,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    };
  }

  async getTopProductsReport(dateRange: DateRangeDto) {
    const { startDate, endDate } = this._parseDateRange(dateRange);

    const items = await this.prisma.orderItem.findMany({
      where: {
        order: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      },
      include: { product: true },
    });

    const productSales = items.reduce((acc, item) => {
      const existing = acc.find((p) => p.productId === item.productId);
      if (existing) {
        existing.quantity += item.quantity;
        existing.revenue += item.unitPrice * item.quantity;
      } else {
        acc.push({
          productId: item.productId,
          productName: item.product.name,
          quantity: item.quantity,
          revenue: item.unitPrice * item.quantity,
        });
      }
      return acc;
    }, [] as any[]);

    return productSales.sort((a, b) => b.revenue - a.revenue).slice(0, 10);
  }

  async getRevenueReport(dateRange: DateRangeDto) {
    const { startDate, endDate } = this._parseDateRange(dateRange);

    const payments = await this.prisma.payment.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const byMethod = payments.reduce((acc, payment) => {
      const existing = acc.find((p) => p.method === payment.method);
      if (existing) {
        existing.amount += payment.amount;
        existing.count += 1;
      } else {
        acc.push({
          method: payment.method,
          amount: payment.amount,
          count: 1,
        });
      }
      return acc;
    }, [] as any[]);

    return {
      period: { startDate, endDate },
      byPaymentMethod: byMethod,
      totalRevenue: payments.reduce((sum, p) => sum + p.amount, 0),
    };
  }

  async getOrdersReport(dateRange: DateRangeDto) {
    const { startDate, endDate } = this._parseDateRange(dateRange);

    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const byStatus = orders.reduce((acc, order) => {
      const existing = acc.find((o) => o.status === order.status);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({
          status: order.status,
          count: 1,
        });
      }
      return acc;
    }, [] as any[]);

    return {
      period: { startDate, endDate },
      totalOrders: orders.length,
      byStatus,
    };
  }

  private _parseDateRange(dateRange: DateRangeDto) {
    const startDate = dateRange.startDate
      ? new Date(dateRange.startDate)
      : this._getStartOfDay(new Date());
    const endDate = dateRange.endDate
      ? new Date(dateRange.endDate)
      : this._getEndOfDay(new Date());

    return { startDate, endDate };
  }

  private _getStartOfDay(date: Date): Date {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  private _getEndOfDay(date: Date): Date {
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return end;
  }
}
