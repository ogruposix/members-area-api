import {
  Injectable,
  NotFoundException,
  // UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CartpandaService } from "src/cartpanda/cartpanda.service";
import { OrderService } from "src/order/order.service";
import { UserService } from "src/user/user.service";
// import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly cartpandaService: CartpandaService,
    private readonly orderService: OrderService
  ) {}

  async signIn(
    email: string,
    password?: string
  ): Promise<{ access_token: string }> {
    const emailSanitized = email.trim().toLowerCase();
    let user = await this.userService.findOne(emailSanitized);

    if (!user) {
      const cartpandaUser = await this.cartpandaService.getCustomerByEmail(
        emailSanitized
      );

      if (!cartpandaUser) {
        throw new NotFoundException("User not found");
      }

      // If the user is not found in the local database, create a new user in the local database
      user = await this.userService.createUser(
        cartpandaUser.first_name + " " + cartpandaUser.last_name,
        cartpandaUser.email,
        "USER" // Default role for CartPanda users
      );
    }

    this.orderService.updateOrdersForUser(user.email);
    // if (user.role === "ADMIN" && user.password && !password) {
    //   throw new UnauthorizedException("Password is required");
    // }

    // if (user.role === "ADMIN" && user.password) {
    //   const isPasswordValid = await bcrypt.compare(password!, user.password!);

    //   if (isPasswordValid) {
    //     const payload = {
    //       sub: user.id,
    //       email: user.email,
    //       role: user.role,
    //     };

    //     return {
    //       access_token: await this.jwtService.signAsync(payload),
    //     };
    //   }

    //   throw new UnauthorizedException("Invalid credentials");
    // }

    // if (user.role === "USER" && password) {
    //   throw new UnauthorizedException("User cannot sign in with password");
    // }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
