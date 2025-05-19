import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { UserService, PaginatedResponse } from "./user.service";
import { ActiveUserId } from "src/decorators/active-user-id";
import { Public } from "src/decorators/public.decorator";
import { CreateUserDto } from "./dto/create-user.dto";
import { Role } from "src/decorators/roles.decorator";
import { User } from "@prisma/client";

interface PaginationQuery {
  page?: string;
  limit?: string;
}

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/orders")
  async getOrders(@ActiveUserId() userId: string) {
    return await this.userService.getOrdersByUserId(userId);
  }

  @Get("/me")
  async getMe(@ActiveUserId() userId: string) {
    return await this.userService.getUserById(userId);
  }

  @Public()
  @Post("/create")
  async createUser(@Body() body: CreateUserDto) {
    return await this.userService.createUser(body.name, body.email, body.role);
  }

  @Role("ADMIN")
  @Get("all")
  async findAll(
    @Query() query: PaginationQuery
  ): Promise<PaginatedResponse<Partial<User>>> {
    const page = query.page ? parseInt(query.page) : undefined;
    const limit = query.limit ? parseInt(query.limit) : undefined;

    return await this.userService.findAll({ page, limit });
  }

  @Role("ADMIN")
  @Get("search")
  async searchUser(@Query("query") query: string) {
    return await this.userService.searchUser(query);
  }

  @Role("ADMIN")
  @Get("count")
  async countUsers() {
    return await this.userService.countUsers();
  }

  @Role("ADMIN")
  @Get(":id")
  async getUserById(@Param("id") id: string) {
    return await this.userService.getUserById(id);
  }
}
