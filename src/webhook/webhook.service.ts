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

  async getOrders(): Promise<WebhookResponse> {
    try {
      const response = await axios.get(this.apiUrl, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      const orders = response.data.orders.data;

      const result = orders.map((order: any) => ({
        email: order.email,
        title: order.line_items.map((item: any) => item.title),
      }));

      return result;
    } catch (error) {
      console.error("Erro ao fazer a requisição à API:", error);
      throw new Error("Erro ao processar a requisição");
    }
  }

  @Cron("*/5 * * * *")
  async handleCron() {
    console.log("Executando cron job...");

    const orders = await this.getOrders();

    if (!Array.isArray(orders)) {
      console.error("Os pedidos retornados não são um array");
      return;
    }

    for (const order of orders) {
      const { email, title } = order;

      const existingUser = await this.userService.getUserByEmail(email);

      if (existingUser) {
        return null;
      }
      await this.userService.createUser(email, title);
      console.log(`Usuário criado: ${email}`);
    }
  }
}
