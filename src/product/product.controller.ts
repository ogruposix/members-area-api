import { Body, Controller, Get, Logger, Param, Post } from "@nestjs/common";
import { ProductService } from "./product.service";
import { Prisma } from "@prisma/client";
import { Role } from "src/decorators/roles.decorator";
import { ActiveUserId } from "src/decorators/active-user-id";

@Controller("product")
export class ProductController {
  private readonly logger = new Logger(ProductController.name);
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll() {
    return this.productService.findAll();
  }

  @Role("ADMIN")
  @Post()
  async create(
    @Body() product: Prisma.ProductCreateInput,
    @ActiveUserId() userId: string
  ) {
    this.logger.log(`User ${userId} is creating a new product`);
    return this.productService.create(product);
  }

  @Get(":name")
  async getProductId(@Param("name") name: string) {
    return this.productService.findOne(name);
  }
}
