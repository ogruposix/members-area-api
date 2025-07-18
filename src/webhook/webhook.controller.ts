import { Body, Controller, Post, HttpCode, HttpStatus } from "@nestjs/common";
import { WebhookService } from "./webhook.service";
import { WebhookPayload } from "./types/webhook-payload";
import { Public } from "src/decorators/public.decorator";
import { WebhookResponse } from "./types/webhook-response";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { createColoredMessage, SLACK_COLORS } from "src/utils/slack";

@Controller("webhook")
export class WebhookController {
  constructor(
    private readonly webhookService: WebhookService,
    private readonly configService: ConfigService
  ) {}

  @Public()
  @Post("paid-order")
  @HttpCode(HttpStatus.OK)
  async paidOrder(@Body() payload: WebhookPayload): Promise<WebhookResponse> {
    console.log(
      "OrderId:",
      payload.order.id,
      "Order Created At:",
      payload.order.created_at,
      "Tracking Number:",
      payload.order.tracking_number,
      "First Name:",
      payload.order.customer.first_name,
      "Email:",
      payload.order.email,
      "Tracking Company:",
      payload.order?.fulfillments[0]?.tracking_company || null,
      "Shipping Created At:",
      payload.order?.fulfillments[0]?.created_at || null,
      "ItemsTitle:",
      payload.order.line_items.map((item) => item.title)
    );
    return await this.webhookService.paidOrder(payload);
  }

  @Public()
  @Post("slack")
  async slack(@Body() payload: WebhookPayload) {
    const { order } = payload;

    const successMessage = createColoredMessage(
      "🎉 Produto Comprado com Sucesso!",
      SLACK_COLORS.SUCCESS,
      [
        {
          title: "Produto",
          value: order.line_items[0].title || "Produto não identificado",
          short: true,
        },
        {
          title: "Cliente",
          value: order.customer.first_name + " " + order.customer.last_name,
          short: true,
        },
        {
          title: "Valor",
          value: Number(order.payment.actual_price_paid).toLocaleString(
            "en-US",
            {
              style: "currency",
              currency: "USD",
            }
          ),
          short: true,
        },
        {
          title: "Data",
          value: new Date(order.created_at).toLocaleString("en-US", {
            timeZone: "America/Scoresbysund",
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          short: true,
        },
      ]
    );

    try {
      await axios.post(
        this.configService.get("SLACK_WEBHOOK")!,
        successMessage
      );
    } catch (error) {
      console.log(error);
    }
  }

  // @Post("email-test")
  // async testEmail() {
  //   return this.webhookService.testEmail();
  // }
}
