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
    console.log(
      payload.order.id,
      payload.order.tracking_number,
      payload.order.customer.first_name,
      payload.order.email,
      payload.order?.fulfillments[0]?.tracking_company || null,
      payload.order?.fulfillments[0]?.created_at || null,
      payload.order.line_items.map((item) => item.title)
    );
    return await this.webhookService.paidOrder(payload);
  }

  // @Post("email-test")
  // async testEmail() {
  //   return this.webhookService.testEmail();
  // }
}
