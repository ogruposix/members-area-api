import { Module } from "@nestjs/common";
import { FileService } from "./file.service";
import { FileController } from "./file.controller";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
  providers: [FileService, PrismaService],
  exports: [FileService],
  controllers: [FileController],
})
export class FileModule {}
