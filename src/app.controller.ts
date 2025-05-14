import { Body, Controller, Post } from "@nestjs/common";
import { Public } from "./decorators/public.decorator";

@Controller()
export class AppController {
  @Public()
  @Post()
  async testPayload(@Body() payload: any) {
    console.log(payload || "No payload");
  }
}
