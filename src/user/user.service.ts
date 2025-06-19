import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Order, Role, User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { InjectRedis } from "@nestjs-modules/ioredis";
import Redis from "ioredis";
import { CartpandaService } from "src/cartpanda/cartpanda.service";
interface PaginationParams {
  page?: number;
  limit?: number;
  role?: Role;
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
  constructor(
    private prisma: PrismaService,
    private readonly cartpanda: CartpandaService,
    @InjectRedis() private readonly redis: Redis
  ) {}

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
    const dbOrders = await this.prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        product: true,
      },
    });

    if (!dbOrders || dbOrders.length === 0) {
      throw new NotFoundException(`No orders found for user with ID ${userId}`);
    }

    const orderSums: any[] = [];

    for (const order of dbOrders) {
      // Fetch order details from CartPanda
      const cartpandaOrder = await this.cartpanda.getOrderById(order.id);
      if (!cartpandaOrder) {
        throw new NotFoundException(
          `Order with ID ${order.id} not found in CartPanda`
        );
      }

      // Update the order with CartPanda data
      orderSums.push({
        ...order,
        items: cartpandaOrder.order.line_items,
      });
    }

    return orderSums;
  }

  async getUserById(userId: string): Promise<Partial<User>> {
    let cachedUser = await this.redis.get(`user:${userId}`);

    if (cachedUser) {
      return JSON.parse(cachedUser);
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        imageUrl: true,
        orders: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    // Cache the user data
    await this.redis.set(`user:${userId}`, JSON.stringify(user), "EX", 3600); // Cache for 1 hour
    // Return the user data

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
        where: {
          role: params?.role,
        },
      }),
      this.prisma.user.count({
        where: {
          role: params?.role,
        },
      }),
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

  async searchUser(query: string): Promise<User[]> {
    const user = await this.prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
    });

    return user;
  }

  async countUsers(): Promise<{ adminsLength: number; usersLength: number }> {
    const adminsLength = await this.prisma.user.count({
      where: {
        role: "ADMIN",
      },
    });

    const usersLength = await this.prisma.user.count({
      where: {
        role: "USER",
      },
    });

    return {
      adminsLength,
      usersLength,
    };
  }

  async updateUser(userId: string, data: Partial<User>) {
    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);

      return await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          ...data,
          password: hashedPassword,
        },
      });
    }

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data,
    });
  }
}
