import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Order, Prisma } from "@prisma/client";
import { CartpandaService } from "src/cartpanda/cartpanda.service";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private readonly cartpandaService: CartpandaService
  ) {}

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

  async updateOrdersForUser(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const orders = await this.prisma.order.findMany({
      where: {
        userId: user.id,
      },
    });

    const cartOrders = await this.cartpandaService.getOrdersByCustomerEmail(
      email
    );

    for (const order of cartOrders.orders) {
      const existingOrder = orders.find((o) => o.id === `${order.id}`);

      if (!existingOrder) {
        const productName = order.line_items[0].title;

        const words = productName
          .split(/[\s\-_,]+/)
          .filter((word) => word.length > 2)
          .map((word) => word.trim());

        const product = await this.prisma.product.findFirst({
          where: {
            OR: words.map((word) => ({
              name: {
                contains: word,
                mode: "insensitive",
              },
            })),
          },
        });

        // last fullfullment by created_at
        const lastFulfillment = order.fulfillments?.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0];

        await this.createOrder({
          id: `${order.id}`,
          userId: user.id,
          productId: product?.id,
          trackingNumber: lastFulfillment.tracking_number || null,
          shippingProvider: lastFulfillment.tracking_company || null,
          shippingDate: lastFulfillment.created_at,
          createdAt: new Date(order.created_at),
          updatedAt: new Date(order.created_at),
        });
      } else {
        const lastFulfillment = order.fulfillments?.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0];

        if (
          lastFulfillment?.tracking_number &&
          lastFulfillment?.tracking_number !== existingOrder.trackingNumber
        ) {
          await this.updateOrder(existingOrder.id, {
            trackingNumber: lastFulfillment.tracking_number,
            shippingProvider: lastFulfillment.tracking_company || null,
            shippingDate: new Date(lastFulfillment.created_at),
            updatedAt: new Date(),
          });
        }
      }
    }
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
