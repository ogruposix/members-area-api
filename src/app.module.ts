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
import { ProductController } from './product/product.controller';
import { ProductService } from './product/product.service';
import { ProductModule } from './product/product.module';

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
  ],
  controllers: [AppController, ProductController],
  providers: [AppService, ProductService],
})
export class AppModule {}
