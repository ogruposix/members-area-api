import { Module } from "@nestjs/common";
import { WebhookController } from "./webhook.controller";
import { WebhookService } from "./webhook.service";
import { UserModule } from "src/user/user.module";
import { EmailModule } from "src/email/email.module";
import { OrderModule } from "src/order/order.module";
import { ProductModule } from "src/product/product.module";

@Module({
  controllers: [WebhookController],
  providers: [WebhookService],
  imports: [UserModule, EmailModule, OrderModule, ProductModule],
})
export class WebhookModule {}
