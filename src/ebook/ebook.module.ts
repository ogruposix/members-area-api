import { Module } from "@nestjs/common";
import { EbookController } from "./ebook.controller";
import { EbookService } from "./ebook.service";
import { PrismaService } from "src/prisma/prisma.service";
import { FileService } from "src/file/file.service";

@Module({
  controllers: [EbookController],
  providers: [EbookService, PrismaService, FileService],
})
export class EbookModule {}
