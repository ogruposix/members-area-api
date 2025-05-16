import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Order, User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(name: string, email: string): Promise<User> {
    const userAlreadyExists = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userAlreadyExists) {
      throw new BadRequestException("User already exists");
    }

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
      },
    });

    return user;
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return await this.prisma.order.findMany({
      where: {
        userId,
      },
    });
  }

  async getUserById(userId: string): Promise<Partial<User>> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  async findOne(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}
