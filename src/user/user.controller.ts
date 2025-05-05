import { Controller, Get, Param, Query } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("products")
  async getUserProducts(@Query("email") email: string) {
    const products = await this.userService.getProductsByEmail(email);

    return { products };
  }

  @Get(":email")
  async getUserByEmail(@Param("email") email: string) {
    const user = await this.userService.getUserByEmail(email);

    return user;
  }
}
