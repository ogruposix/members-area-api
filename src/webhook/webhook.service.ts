import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { WebhookResponse } from "./types/webhook-response";
import { Cron } from "@nestjs/schedule";
import { UserService } from "src/user/user.service";
import { EmailService } from "src/email/email.service";

@Injectable()
export class WebhookService {
  private apiUrl: string;
  private token: string;
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private emailService: EmailService
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
      payload.order.line_items.map((item: any) => item.title)
    );

    await this.userService.createUser(
      payload.order.email,
      payload.order.line_items.map((item: any) => item.title)
    );
  }

  async testEmail() {
    await this.emailService.sendEmail(
      "mtguerson@gmail.com",
      "Teste",
      "Teste de email",
      `<h1>Obrigado por se cadastrar!</h1>`
    );

    return { message: "Email enviado com sucesso!" };
  }
}
