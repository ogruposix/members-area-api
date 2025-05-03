import { Controller, Get, Query } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUserByEmail(@Query("email") email: string) {
    const user = await this.userService.getUserByEmail(email);

    return user;
  }

  @Get("products")
  async getUserProducts(@Query("email") email: string) {
    const products = await this.userService.getProductsByEmail(email);

    return { products };
  }
}
