import { Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async signIn(email: string): Promise<{ access_token: string }> {
    const user = await this.userService.findOne(email);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const payload = {
      sub: user.id,
      email: user.email,
      roles: [user.role],
    };

    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
