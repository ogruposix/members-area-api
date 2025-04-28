import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async signIn(email: string): Promise<any> {
    return await this.userService.findOne(email);
  }
}
