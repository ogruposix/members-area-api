import { Body, Controller, Get, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { ActiveUserId } from "src/decorators/active-user-id";
import { Public } from "src/decorators/public.decorator";
import { CreateUserDto } from "./dto/create-user.dto";
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

  @Public()
  @Post("/create")
  async createUser(@Body() body: CreateUserDto) {
    return await this.userService.createUser(
      body.name,
      body.email,
      body.products as string[]
    );
  }
}
