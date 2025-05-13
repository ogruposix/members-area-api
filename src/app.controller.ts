import { Body, Controller, Post } from "@nestjs/common";
import { Public } from "./decorators/public.decorator";
@Controller()
export class AppController {
  @Public()
  @Post()
  async getPayload(@Body() body: any) {
    console.log(body);
  }
}
