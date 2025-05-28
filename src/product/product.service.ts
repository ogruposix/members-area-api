import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.product.findMany();
  }

  async create(product: Product) {
    return this.prisma.product.create({
      data: product,
    });
  }

  async findOne(query: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        name: {
          contains: query,
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }
}
