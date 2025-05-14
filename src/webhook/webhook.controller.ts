import { Body, Controller, Post, HttpCode, HttpStatus } from "@nestjs/common";
import { WebhookService } from "./webhook.service";
import { WebhookPayload } from "./types/webhook-payload";
import { Public } from "src/decorators/public.decorator";
import { WebhookResponse } from "./types/webhook-response";

@Controller("webhook")
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Public()
  @Post("paid-order")
  @HttpCode(HttpStatus.OK)
  async paidOrder(@Body() payload: WebhookPayload): Promise<WebhookResponse> {
    return await this.webhookService.paidOrder(payload);
  }

  // @Post("email-test")
  // async testEmail() {
  //   return this.webhookService.testEmail();
  // }
}
