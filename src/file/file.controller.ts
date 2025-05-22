import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileService } from "./file.service";
import { Role } from "src/decorators/roles.decorator";
import { ActiveUserId } from "src/decorators/active-user-id";
import { PrismaService } from "src/prisma/prisma.service";

@Role("ADMIN")
@Controller("file")
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly prismaService: PrismaService
  ) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2, // 2MB
          }),
          new FileTypeValidator({
            fileType: ".(png|jpg|jpeg)",
          }),
        ],
      })
    )
    file: Express.Multer.File,
    @ActiveUserId() userId: string
  ) {
    const { url } = await this.fileService.uploadFile(file);

    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        imageUrl: url,
      },
    });
  }
}
