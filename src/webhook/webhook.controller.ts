import { Body, Controller, Get, Post } from "@nestjs/common";
import { WebhookService } from "./webhook.service";

@Controller("webhook")
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Get()
  async getOrders() {
    return this.webhookService.getOrders();
  }

  @Post("paid-order")
  async paidOrder(@Body() payload: any) {
    return this.webhookService.paidOrder(payload);
  }

  @Post("email-test")
  async testEmail() {
    return this.webhookService.testEmail();
  }
}
