import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { PrismaService } from "src/prisma/prisma.service";
import { UserController } from "./user.controller";
import { CartpandaModule } from "src/cartpanda/cartpanda.module";

@Module({
  imports: [CartpandaModule],
  providers: [UserService, PrismaService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
