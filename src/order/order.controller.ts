import { Body, Controller, Post } from "@nestjs/common";
import { OrderService } from "./order.service";
import { Order } from "@prisma/client";

@Controller("order")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() order: Order) {
    await this.orderService.createOrder(order);
  }
}
