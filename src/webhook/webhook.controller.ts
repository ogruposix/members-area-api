import { Body, Controller, Post } from "@nestjs/common";
import { WebhookService } from "./webhook.service";
import { WebhookPayload } from "./types/webhook-payload";
import { Public } from "src/decorators/public.decorator";

@Controller("webhook")
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Public()
  @Post("paid-order")
  async paidOrder(@Body() payload: WebhookPayload) {
    return this.webhookService.paidOrder(payload);
  }

  // @Post("email-test")
  // async testEmail() {
  //   return this.webhookService.testEmail();
  // }
}
