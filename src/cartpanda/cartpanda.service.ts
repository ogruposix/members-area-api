// src/cartpanda/cartpanda.service.ts
import { HttpService } from "@nestjs/axios";
import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AxiosError } from "axios";
import { firstValueFrom, catchError } from "rxjs";

@Injectable()
export class CartpandaService {
  private readonly logger = new Logger(CartpandaService.name);
  private readonly baseUrl: string;
  private readonly token: string;
  private readonly slug: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.slug = this.configService.get<string>("CARTPANDA_SLUG") || "";
    this.token = this.configService.get<string>("CARTPANDA_TOKEN") || "";
    this.baseUrl = `https://accounts.cartpanda.com/api/v3/${this.slug}/`;

    if (!this.slug || !this.token) {
      throw new Error("CartPanda slug or Key is not defined in .env file");
    }

    this.httpService.axiosRef.defaults.baseURL = this.baseUrl;
    this.httpService.axiosRef.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${this.token}`;
  }

  // Example Method: Get all products from CartPanda
  async getOrderById(orderId: string): Promise<{
    order: {
      id: string;
      line_items: Array<{
        id: string;
        name: string;
        price: number;
        sku: string;
        quantity: number;
        variant_title: string;
        variant_id: string;
      }>;
    };
  }> {
    // 1. Corrected Log Message: Now accurately describes the action.
    this.logger.log(`Fetching order with ID: ${orderId} from CartPanda...`);
    try {
      const { data } = await firstValueFrom(
        // 2. Corrected Endpoint: Uses the 'orderId' to build the correct URL.
        // NOTE: The endpoint is assumed to be `/orders/`. Please verify this in the CartPanda API documentation.
        this.httpService.get(`/orders/${orderId}`).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(
              `Error response from CartPanda:`,
              error.response?.data
            );
            // 3. Corrected Error Message: Provides a specific and helpful error.
            throw new InternalServerErrorException(
              `Error fetching order with ID ${orderId} from CartPanda.`
            );
          })
        )
      );
      return data;
    } catch (error) {
      // 4. Corrected Catch Block Log: Helps pinpoint failures.
      this.logger.error(`Failed to get order ${orderId}`, error.stack);
      // Re-throw the error so the caller can handle it (e.g., return a 500 status to the client).
      throw error;
    }
  }
}
