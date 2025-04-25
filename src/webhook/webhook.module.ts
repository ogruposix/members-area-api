import { Module } from "@nestjs/common";
import { WebhookController } from "./webhook.controller";
import { WebhookService } from "./webhook.service";
import { UserModule } from "src/user/user.module";

@Module({
  controllers: [WebhookController],
  providers: [WebhookService],
  imports: [UserModule],
})
export class WebhookModule {}
