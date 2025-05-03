import { Body, Controller, Post } from "@nestjs/common";
import { WebhookService } from "./webhook.service";
import { WebhookPayload } from "./types/webhook-payload";

@Controller("webhook")
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post("paid-order")
  async paidOrder(@Body() payload: WebhookPayload) {
    return this.webhookService.paidOrder(payload);
  }

  @Post("email-test")
  async testEmail() {
    return this.webhookService.testEmail();
  }
}
