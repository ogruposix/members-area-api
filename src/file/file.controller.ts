import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileService } from "./file.service";
import { Role } from "src/decorators/roles.decorator";
import { PrismaService } from "src/prisma/prisma.service";

@Role("ADMIN")
@Controller("file")
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly prismaService: PrismaService
  ) {}

  @Post("upload/:ebookId")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 60, // 60MB
          }),
          new FileTypeValidator({
            fileType: ".(pdf)",
          }),
        ],
      })
    )
    file: Express.Multer.File,
    @Param("ebookId") ebookId: string
  ) {
    const { url } = await this.fileService.uploadFile(file);

    await this.prismaService.ebook.update({
      where: {
        id: ebookId,
      },
      data: {
        pdfUrl: url,
        pdfUrlCreatedAt: new Date(),
      },
    });

    return {
      url,
    };
  }
}
