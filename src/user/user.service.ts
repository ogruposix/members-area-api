import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Order, Role, User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(name: string, email: string, role?: Role): Promise<User> {
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
        role,
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

  async findOne(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }

  async findAll(
    params?: PaginationParams
  ): Promise<PaginatedResponse<Partial<User>>> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
        skip,
        take: limit,
      }),
      this.prisma.user.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }
}
