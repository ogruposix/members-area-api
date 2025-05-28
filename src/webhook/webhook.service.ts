import { BadRequestException, Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { WebhookPayload } from "./types/webhook-payload";
import { OrderService } from "src/order/order.service";
import { WebhookResponse } from "./types/webhook-response";
import { ProductService } from "src/product/product.service";

interface OrderLineItem {
  title: string;
  [key: string]: any;
}

interface OrderCustomer {
  first_name: string;
  [key: string]: any;
}

interface Order {
  id: string | number;
  customer: OrderCustomer;
  email: string;
  line_items: OrderLineItem[];
  tracking_number: string | null;
  [key: string]: any;
}

@Injectable()
export class WebhookService {
  constructor(
    private readonly userService: UserService,
    private readonly productService: ProductService,
    private readonly orderService: OrderService // private readonly emailService: EmailService
  ) {}

  async paidOrder(payload: WebhookPayload): Promise<WebhookResponse> {
    const { order } = payload;
    const orderId = order.id.toString();

    const existingOrder = await this.orderService.findOne(orderId);

    if (existingOrder?.trackingNumber) {
      return {
        message: "Order already completed",
      };
    }

    if (existingOrder && order.tracking_number === null) {
      throw new BadRequestException("Tracking number not updated yet");
    }

    if (order.tracking_number) {
      if (existingOrder) {
        await this.orderService.updateOrder(orderId, {
          trackingNumber: order.tracking_number.toString(),
        });
      } else {
        const user = await this.createUser(
          order.customer.first_name,
          order.email
        );

        const productName = this.extractProductName((order as Order).line_items);

        const { id: productId } = await this.productService.findOne(productName)

        await this.createOrder(order as Order, user.id, productId);
      }

      return {
        message: "Order updated successfully",
      };
    }

    if (!existingOrder) {
      const productName = this.extractProductName((order as Order).line_items);

      const userExists = await this.userService.findOne(order.customer.email);

      if (!userExists) {
        const user = await this.createUser(
          order.customer.first_name,
          order.email
        );

        const { id: productId } = await this.productService.findOne(productName)

        await this.createOrder(order as Order, user.id, productId);

        return {
          message: "Order and User created successfully",
        };
      }

      const { id: productId } = await this.productService.findOne(productName)

      await this.createOrder(order as Order, userExists.id, productId);

      return {
        message: "Order created successfully",
      };
    }

    throw new BadRequestException("Tracking number not updated yet");
  }

  private extractProductName(lineItems: OrderLineItem[]): string {
    return lineItems[0].title;
  }

  private async createUser(firstName: string, email: string) {
    return await this.userService.createUser(firstName, email);
  }

  private async createOrder(order: Order, userId: string, productId: string) {
    await this.orderService.createOrder({
      id: order.id.toString(),
      productId,
      trackingNumber: order.tracking_number?.toString() || null,
      userId,
    });
  }

  // async testEmail() {
  //   await this.emailService.sendEmail(
  //     "mtguerson@gmail.com",
  //     "Bem vindo ao Six Health!",
  //     "Six Health App",
  //     `<!DOCTYPE html>
  //     <html lang="pt-br">
  //     <head>
  //       <meta charset="UTF-8">
  //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //       <title>Bem-vindo ao Six Health!</title>
  //       <style>
  //         body {
  //           font-family: Arial, sans-serif;
  //           background-color: #f5f5f5;
  //           color: #333;
  //           margin: 0;
  //           padding: 0;
  //         }
  //         .container {
  //           width: 100%;
  //           max-width: 600px;
  //           margin: 20px auto;
  //           padding: 20px;
  //           background-color: #ffffff;
  //           border-radius: 8px;
  //           box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  //         }
  //         h1 {
  //           color: #4CAF50;
  //           text-align: center;
  //         }
  //         p {
  //           font-size: 16px;
  //           text-align: center;
  //           margin-bottom: 20px;
  //         }
  //         .cta-buttons {
  //           display: flex;
  //           justify-content: center;
  //           gap: 15px;
  //         }
  //         .cta-buttons a {
  //           display: inline-block;
  //           padding: 15px 30px;
  //           background-color: #4CAF50;
  //           color: #fff;
  //           text-decoration: none;
  //           font-size: 16px;
  //           border-radius: 5px;
  //           transition: background-color 0.3s ease;
  //         }
  //         .cta-buttons a:hover {
  //           background-color: #45a049;
  //         }
  //         .app-store {
  //           background-color: #0070ba;
  //         }
  //         .play-store {
  //           background-color: #34b7f1;
  //         }
  //         .footer {
  //           text-align: center;
  //           margin-top: 20px;
  //           font-size: 12px;
  //           color: #888;
  //         }
  //       </style>
  //     </head>
  //     <body>

  //       <div class="container">
  //         <h1>Bem-vindo ao Six Health!</h1>
  //         <p>Olá, <strong>usuário!</strong> Agora você tem acesso ao nosso aplicativo incrível! Aproveite a experiência de navegar e explorar nossas funcionalidades exclusivas diretamente do seu celular.</p>

  //         <div class="cta-buttons">
  //           <!-- Link para Play Store -->
  //           <a href="https://play.google.com/store/apps/details?id=com.exemplo.app" class="play-store" target="_blank">Baixar na Play Store</a>

  //           <!-- Link para App Store -->
  //           <a href="https://apps.apple.com/us/app/id1234567890" class="app-store" target="_blank">Baixar na App Store</a>
  //         </div>

  //         <div class="footer">
  //           <p>Se você tiver algum problema, entre em contato com nosso suporte ao cliente.</p>
  //           <p>&copy; 2025 Six Health - Todos os direitos reservados.</p>
  //         </div>
  //       </div>

  //     </body>
  //     </html>
  //     `
  //   );

  //   return { message: "Email sent successfully!" };
  // }
}
