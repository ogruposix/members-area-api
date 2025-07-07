import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { CartpandaModule } from "src/cartpanda/cartpanda.module";

@Module({
  imports: [CartpandaModule],
  providers: [OrderService, PrismaService],
  exports: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
