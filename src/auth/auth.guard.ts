import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { IS_PUBLIC_KEY } from "src/decorators/public.decorator";
import { ConfigService } from "@nestjs/config";
import { ROLE_KEY } from "../decorators/roles.decorator";
import { Role } from "@prisma/client";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private configService: ConfigService
  ) {}

  private hasRequiredRole(userRole: Role, requiredRole: Role): boolean {
    if (userRole === Role.ADMIN) {
      return true;
    }

    return userRole === requiredRole;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException("Token not provided");
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>("JWT_SECRET"),
      });

      const requiredRole = this.reflector.getAllAndOverride<Role>(ROLE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (!requiredRole) {
        request["user"] = payload;
        return true;
      }

      const userRole = payload.role;

      if (!this.hasRequiredRole(userRole, requiredRole)) {
        throw new UnauthorizedException("Insufficient permission");
      }

      request["user"] = payload;
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException("Invalid or expired token");
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
