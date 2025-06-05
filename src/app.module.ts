import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { WebhookModule } from "./webhook/webhook.module";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { AuthModule } from "./auth/auth.module";
import { EmailModule } from "./email/email.module";
import { OrderModule } from "./order/order.module";
import { UserModule } from "./user/user.module";
import { FileModule } from "./file/file.module";
import { ProductModule } from "./product/product.module";
import { RedisModule } from "@nestjs-modules/ioredis";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    WebhookModule,
    AuthModule,
    EmailModule,
    OrderModule,
    UserModule,
    FileModule,
    ProductModule,
    RedisModule.forRoot({
      type: "single",
      url: process.env.REDIS_URL || "redis://localhost:6379",
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
