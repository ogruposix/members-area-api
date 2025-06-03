import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, Product } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.product.findMany();
  }

  async create(product: Prisma.ProductCreateInput) {
    return this.prisma.product.create({
      data: product,
    });
  }

  async findOne(query: string) {
    let product = await this.prisma.product.findFirst({
      where: {
        name: query,
      },
    });

    if (!product) {
      const words = query
        .split(/[\s\-_,]+/)
        .filter((word) => word.length > 2)
        .map((word) => word.trim());

      if (words.length > 0) {
        product = await this.prisma.product.findFirst({
          where: {
            OR: words.map((word) => ({
              name: {
                contains: word,
                mode: "insensitive",
              },
            })),
          },
        });
      }
    }

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return product;
  }
}
