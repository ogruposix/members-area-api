import { Controller, Get, Query } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("products")
  async getUserProducts(@Query("email") email: string) {
    const products = await this.userService.getProductsByEmail(email);

    return { products };
  }
}
