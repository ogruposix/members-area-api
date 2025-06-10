import { Controller, Get, Param, Res } from "@nestjs/common";
import { Role } from "src/decorators/roles.decorator";
import { FileService } from "./file.service";
import { Response } from "express";

@Role("ADMIN")
@Controller("files")
export class FileController {
  constructor(private readonly fileService: FileService) {}

  // /files/ebook/:filename.pdf
  @Get("ebook/:filename")
  async getEbookFile(
    @Param("filename") filename: string,
    @Res() res: Response
  ) {
    const ebookFile = await this.fileService.getEbookFile(filename);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
    });

    ebookFile.pipe(res);
  }
}
