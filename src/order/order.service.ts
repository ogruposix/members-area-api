import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Order, Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder(order: Prisma.OrderCreateArgs["data"]) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: order.userId,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const orderExists = await this.prisma.order.findUnique({
      where: {
        id: order.id,
      },
    });

    if (orderExists) {
      throw new BadRequestException("Order already exists");
    }

    return await this.prisma.order.create({
      data: order,
    });
  }

  async findOne(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    return order;
  }

  async updateOrder(orderId: string, order: Partial<Order>) {
    return await this.prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        ...order,
      },
    });
  }
}
