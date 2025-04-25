import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // Função para criar um novo usuário
  async createUser(email: string, products: string[]): Promise<any> {
    return await this.prisma.user.create({
      data: {
        email,
        products,
      },
    });
  }

  // Função para buscar um usuário pelo email
  async getUserByEmail(email: string): Promise<any> {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  // Função para adicionar produtos a um usuário existente
  async addProductsToUser(email: string, products: string[]): Promise<any> {
    return await this.prisma.user.update({
      where: {
        email,
      },
      data: {
        products: {
          push: products, // Adiciona os novos produtos ao array existente
        },
      },
    });
  }
}
