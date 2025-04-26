import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { WebhookResponse } from "./types/webhook-response";
import { Cron } from "@nestjs/schedule";
import { UserService } from "src/user/user.service";

@Injectable()
export class WebhookService {
  private apiUrl: string;
  private token: string;
  constructor(
    private configService: ConfigService,
    private userService: UserService
  ) {
    const apiUrl = this.configService.get<string>("API_URL");
    const token = this.configService.get<string>("TOKEN");

    if (!apiUrl) {
      throw new Error("API_URL não está definida nas variáveis de ambiente");
    }

    if (!token) {
      throw new Error("TOKEN não está definido nas variáveis de ambiente");
    }

    this.apiUrl = apiUrl;
    this.token = token;
  }

  async getOrders(): Promise<any> {
    console.log("Hello World");
    return "Hello World";
  }

  async paidOrder(payload: any): Promise<any> {
    console.log(
      "Payload recebido:",
      payload.order.email,
      payload.order.line_items.title.map((item: any) => item.title)
    );

    await this.userService.createUser(
      payload.order.email,
      payload.order.line_items.map((item: any) => item.title)
    );
  }
}
