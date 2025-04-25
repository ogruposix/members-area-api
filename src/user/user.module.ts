import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
  providers: [UserService, PrismaService], // Declara o UserService e o PrismaService
  exports: [UserService], // Exporta o UserService para que possa ser usado em outros módulos
})
export class UserModule {}
