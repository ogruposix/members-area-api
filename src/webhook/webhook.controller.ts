import { Controller, Get } from "@nestjs/common";
import { WebhookService } from "./webhook.service";

@Controller("webhook")
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Get()
  async getOrders() {
    return this.webhookService.getOrders();
  }
}
