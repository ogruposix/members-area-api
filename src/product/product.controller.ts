import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ProductService } from "./product.service";
import { Prisma } from "@prisma/client";
import { Role } from "src/decorators/roles.decorator";

@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll() {
    return this.productService.findAll();
  }

  @Role("ADMIN")
  @Post()
  async create(@Body() product: Prisma.ProductCreateInput) {
    return this.productService.create(product);
  }

  @Get(":name")
  async getProductId(@Param("name") name: string) {
    return this.productService.findOne(name);
  }
}
