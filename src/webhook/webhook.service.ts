import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { EmailService } from "src/email/email.service";
import { WebhookPayload } from "./types/webhook-payload";

@Injectable()
export class WebhookService {
  constructor(
    private userService: UserService,
    private emailService: EmailService
  ) {}

  async paidOrder(payload: WebhookPayload) {
    console.log(
      "Payload recebido:",
      payload.order.customer.first_name,
      payload.order.email,
      payload.order.line_items.map((item: any) => item.title)
    );

    await this.userService.createUser(
      payload.order.customer.first_name,
      payload.order.email,
      payload.order.line_items.map((item: any) => item.title)
    );
  }

  async testEmail() {
    await this.emailService.sendEmail(
      "mtguerson@gmail.com",
      "Bem vindo ao Six Health!",
      "Six Health App",
      `<!DOCTYPE html>
      <html lang="pt-br">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bem-vindo ao Six Health!</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #4CAF50;
            text-align: center;
          }
          p {
            font-size: 16px;
            text-align: center;
            margin-bottom: 20px;
          }
          .cta-buttons {
            display: flex;
            justify-content: center;
            gap: 15px;
          }
          .cta-buttons a {
            display: inline-block;
            padding: 15px 30px;
            background-color: #4CAF50;
            color: #fff;
            text-decoration: none;
            font-size: 16px;
            border-radius: 5px;
            transition: background-color 0.3s ease;
          }
          .cta-buttons a:hover {
            background-color: #45a049;
          }
          .app-store {
            background-color: #0070ba;
          }
          .play-store {
            background-color: #34b7f1;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #888;
          }
        </style>
      </head>
      <body>

        <div class="container">
          <h1>Bem-vindo ao Six Health!</h1>
          <p>Olá, <strong>usuário!</strong> Agora você tem acesso ao nosso aplicativo incrível! Aproveite a experiência de navegar e explorar nossas funcionalidades exclusivas diretamente do seu celular.</p>
          
          <div class="cta-buttons">
            <!-- Link para Play Store -->
            <a href="https://play.google.com/store/apps/details?id=com.exemplo.app" class="play-store" target="_blank">Baixar na Play Store</a>

            <!-- Link para App Store -->
            <a href="https://apps.apple.com/us/app/id1234567890" class="app-store" target="_blank">Baixar na App Store</a>
          </div>

          <div class="footer">
            <p>Se você tiver algum problema, entre em contato com nosso suporte ao cliente.</p>
            <p>&copy; 2025 Six Health - Todos os direitos reservados.</p>
          </div>
        </div>

      </body>
      </html>
      `
    );

    return { message: "Email enviado com sucesso!" };
  }
}
