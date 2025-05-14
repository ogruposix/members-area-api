import { Controller, Get } from "@nestjs/common";
import { UserService } from "./user.service";
import { ActiveUserId } from "src/decorators/active-user-id";
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/products")
  async getUserProducts(@ActiveUserId() userId: string) {
    return await this.userService.getProductsByUserId(userId);
  }

  @Get("/me")
  async getMe(@ActiveUserId() userId: string) {
    return await this.userService.getUserById(userId);
  }
}
