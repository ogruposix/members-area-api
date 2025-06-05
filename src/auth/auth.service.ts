import {
  Injectable,
  NotFoundException,
  // UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
// import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async signIn(
    email: string,
    password?: string
  ): Promise<{ access_token: string }> {
    const user = await this.userService.findOne(email);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    console.log("User found:", user);

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
