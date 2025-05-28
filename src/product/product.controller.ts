import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from '@prisma/client';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll() {
    return this.productService.findAll();
  }

  @Post()
  async create(@Body() product: Product) {
    return this.productService.create(product);
  }

  @Get(':name')
  async getProductId(@Param('name') name: string) {
    return this.productService.findOne(name);
  }
}
