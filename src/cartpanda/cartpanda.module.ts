import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { CartpandaService } from "./cartpanda.service";

@Module({
  imports: [
    // Import HttpModule to make HttpService available for injection
    HttpModule,
  ],
  providers: [CartpandaService],
  // Export the service to make it available to any module that imports CartpandaModule
  exports: [CartpandaService],
})
export class CartpandaModule {}
