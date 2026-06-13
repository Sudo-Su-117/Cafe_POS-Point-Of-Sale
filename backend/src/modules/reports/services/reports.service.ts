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

  async getAIInsights() {
    const now = new Date();
    const currentStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const prevStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Current period completed orders
    const currentOrders = await this.prisma.order.findMany({
      where: {
        createdAt: { gte: currentStart, lte: now },
        status: 'COMPLETED',
      },
      include: {
        items: { include: { product: { include: { category: true } } } },
        payment: true,
      },
    });

    // Previous period completed orders
    const prevOrders = await this.prisma.order.findMany({
      where: {
        createdAt: { gte: prevStart, lt: currentStart },
        status: 'COMPLETED',
      },
      include: {
        items: { include: { product: true } },
        payment: true,
      },
    });

    const currentRevenue = currentOrders.reduce(
      (sum, o) => sum + (o.payment?.amount || 0),
      0,
    );
    const prevRevenue = prevOrders.reduce(
      (sum, o) => sum + (o.payment?.amount || 0),
      0,
    );

    let revenueGrowth = 0;
    if (prevRevenue > 0) {
      revenueGrowth = ((currentRevenue - prevRevenue) / prevRevenue) * 100;
    }

    const currentProductSales: {
      [key: string]: { name: string; qty: number; revenue: number };
    } = {};
    const prevProductSales: { [key: string]: number } = {};

    for (const o of currentOrders) {
      for (const item of o.items) {
        if (!currentProductSales[item.productId]) {
          currentProductSales[item.productId] = {
            name: item.product.name,
            qty: 0,
            revenue: 0,
          };
        }
        currentProductSales[item.productId].qty += item.quantity;
        currentProductSales[item.productId].revenue +=
          item.unitPrice * item.quantity;
      }
    }

    for (const o of prevOrders) {
      for (const item of o.items) {
        prevProductSales[item.productId] =
          (prevProductSales[item.productId] || 0) + item.quantity;
      }
    }

    const topProducts = Object.values(currentProductSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const categorySales: { [key: string]: number } = {};
    for (const o of currentOrders) {
      for (const item of o.items) {
        const catName = item.product.category?.name || 'Uncategorized';
        categorySales[catName] =
          (categorySales[catName] || 0) + item.unitPrice * item.quantity;
      }
    }

    const totalCatRevenue = Object.values(categorySales).reduce(
      (sum, val) => sum + val,
      0,
    );
    const categoryContributions = Object.entries(categorySales)
      .map(([name, rev]) => ({
        name,
        revenue: rev,
        percentage:
          totalCatRevenue > 0
            ? parseFloat(((rev / totalCatRevenue) * 100).toFixed(1))
            : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    const tableSales: { [key: string]: number } = {};
    const allTables = await this.prisma.table.findMany();
    const tableNameMap = new Map(allTables.map((t) => [t.id, t.name]));

    for (const o of currentOrders) {
      if (o.tableId) {
        const tableName = tableNameMap.get(o.tableId) || `Table ${o.tableId}`;
        const orderTotal = o.items.reduce(
          (sum, item) => sum + item.unitPrice * item.quantity,
          0,
        );
        tableSales[tableName] = (tableSales[tableName] || 0) + orderTotal;
      }
    }

    const topTables = Object.entries(tableSales)
      .map(([name, rev]) => ({ name, revenue: rev }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 3);

    const hourOrders: { [key: number]: number } = {};
    for (const o of currentOrders) {
      const hour = o.createdAt.getHours();
      hourOrders[hour] = (hourOrders[hour] || 0) + 1;
    }

    const peakHours = Object.entries(hourOrders)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    const productDrops: Array<{
      name: string;
      prevQty: number;
      currQty: number;
      dropPercentage: number;
    }> = [];
    for (const [productId, currData] of Object.entries(currentProductSales)) {
      const prevQty = prevProductSales[productId] || 0;
      if (prevQty > 5 && currData.qty < prevQty) {
        const diff = prevQty - currData.qty;
        const dropPct = parseFloat(((diff / prevQty) * 100).toFixed(1));
        if (dropPct >= 10) {
          productDrops.push({
            name: currData.name,
            prevQty,
            currQty: currData.qty,
            dropPercentage: dropPct,
          });
        }
      }
    }
    productDrops.sort((a, b) => b.dropPercentage - a.dropPercentage);

    const dataSummary = {
      currentRevenue,
      prevRevenue,
      revenueGrowth,
      topProducts,
      categoryContributions,
      topTables,
      peakHours,
      productDrops,
    };

    const promptText = `Analyze the following sales performance data for "Cafe POS" and provide 5-6 concise, actionable, bulleted insights and recommendations for the cafe owner.

Data Summary:
- Period: Last 7 Days (vs Prior 7 Days)
- Current Week Revenue: $${currentRevenue.toFixed(2)} (${revenueGrowth >= 0 ? '+' : ''}${revenueGrowth.toFixed(1)}% growth)
- Current Week Orders: ${currentOrders.length}
- Top Products:
${topProducts.map((p) => `  * ${p.name}: ${p.qty} sold, $${p.revenue.toFixed(2)} revenue`).join('\n')}
- Category Contributions:
${categoryContributions.map((c) => `  * ${c.name}: $${c.revenue.toFixed(2)} (${c.percentage}%)`).join('\n')}
- Top Tables:
${topTables.map((t) => `  * ${t.name}: $${t.revenue.toFixed(2)}`).join('\n')}
- Peak Hours:
${peakHours.map((h) => `  * ${h.hour}:00 - ${h.hour + 1}:00 (${h.count} orders)`).join('\n')}
- Significant Drops in Sales Qty:
${productDrops.map((d) => `  * ${d.name}: -${d.dropPercentage}% drop (from ${d.prevQty} to ${d.currQty})`).join('\n')}

Formatting Constraints:
- Return exactly 5-6 bullet points.
- Do not add any greeting, intro, or concluding remarks.
- Provide direct insights first (e.g. "Revenue increased X%", "Y contributes Z% of sales").
- Conclude with a solid recommendation based on the data.`;

    const geminiKey = process.env.GEMINI_API_KEY;
    const openAIKey = process.env.OPENAI_API_KEY;

    if (geminiKey) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
        const response = await globalThis.fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
          }),
        });

        if (response.ok) {
          const resJson: any = await response.json();
          const text = resJson?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return {
              source: 'gemini',
              insights: text
                .split('\n')
                .map((line) => line.trim())
                .filter((line) => line.startsWith('*') || line.startsWith('-') || line.match(/^\d+\./)),
              rawData: dataSummary,
            };
          }
        }
      } catch (err) {
        console.error('Failed to get insights from Gemini API', err);
      }
    }

    if (openAIKey) {
      try {
        const response = await globalThis.fetch(
          'https://api.openai.com/v1/chat/completions',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${openAIKey}`,
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [{ role: 'user', content: promptText }],
              temperature: 0.5,
            }),
          },
        );

        if (response.ok) {
          const resJson: any = await response.json();
          const text = resJson?.choices?.[0]?.message?.content;
          if (text) {
            return {
              source: 'openai',
              insights: text
                .split('\n')
                .map((line) => line.trim())
                .filter((line) => line.startsWith('*') || line.startsWith('-') || line.match(/^\d+\./)),
              rawData: dataSummary,
            };
          }
        }
      } catch (err) {
        console.error('Failed to get insights from OpenAI API', err);
      }
    }

    const localInsights = [
      `Revenue is $${currentRevenue.toFixed(2)} this week (${revenueGrowth >= 0 ? '+' : ''}${revenueGrowth.toFixed(1)}% compared to last week).`,
      topProducts[0]
        ? `${topProducts[0].name} contributes $${topProducts[0].revenue.toFixed(2)} to total sales.`
        : 'No top product recorded.',
      categoryContributions[0]
        ? `${categoryContributions[0].name} contributes ${categoryContributions[0].percentage}% of total sales.`
        : '',
      topTables.length > 0
        ? `Tables ${topTables.map((t) => t.name.replace('Table ', '')).join(' and ')} generate the highest revenue.`
        : '',
      peakHours[0]
        ? `Sales peak between ${peakHours[0].hour % 12 || 12} ${peakHours[0].hour >= 12 ? 'PM' : 'AM'} and ${(peakHours[0].hour + 1) % 12 || 12} ${peakHours[0].hour + 1 >= 12 ? 'PM' : 'AM'}.`
        : '',
      productDrops[0]
        ? `${productDrops[0].name} sales dropped ${productDrops[0].dropPercentage}% compared to last week.`
        : '',
      `Consider running a promotion on ${categoryContributions[categoryContributions.length - 1]?.name || 'beverages'} to boost sales.`,
    ]
      .filter((b) => b !== '')
      .map((b) => `- ${b}`);

    return {
      source: 'local-analytics-fallback',
      insights: localInsights,
      rawData: dataSummary,
    };
  }
}
