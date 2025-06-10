import { Controller, Get, Param, Res } from "@nestjs/common";
import { Role } from "src/decorators/roles.decorator";
import { FileService } from "./file.service";
import { Response } from "express";
import { Public } from "src/decorators/public.decorator";

@Public()
@Controller("files")
export class FileController {
  constructor(private readonly fileService: FileService) {}

  // /files/ebooks/:filename.pdf
  @Get("ebooks/:filename")
  async getEbookFile(
    @Param("filename") filename: string,
    @Res() res: Response
  ) {
    const ebookFile = await this.fileService.getEbookFile(filename);

    // as download
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    });

    ebookFile.pipe(res);
  }
}
