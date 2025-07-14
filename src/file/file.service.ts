import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ReadStream } from "fs";

@Injectable()
export class FileService {
  private filesPath: string;
  private baseUrl: string;
  private readonly logger = new Logger(FileService.name);

  constructor(private readonly configService: ConfigService) {
    this.filesPath = this.configService.get<string>("FILES_PATH") || "/files";
    this.baseUrl =
      this.configService.get<string>("BASE_URL") || "http://localhost:3000";
  }

  async uploadEbookFile(file: Express.Multer.File) {
    if (!file) {
      throw new NotFoundException("File not found");
    }

    if (!file.mimetype || !file.mimetype.includes("pdf")) {
      throw new NotFoundException(
        "Invalid file type. Only PDF files are allowed."
      );
    }

    if (file.size > 1024 * 1024 * 100) {
      throw new NotFoundException(
        "File size exceeds the maximum limit of 100MB."
      );
    }

    const fileName = `${Date.now()}-${file.originalname}`;

    const fs = require("fs");
    const path = require("path");
    const dir = path.join(this.filesPath, "ebooks");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true,
      });
    }
    fs.writeFileSync(path.join(dir, fileName), file.buffer);

    return {
      url: `${this.baseUrl}/files/ebooks/${fileName}`,
      fileName,
    };
  }

  async getEbookFile(fileName: string): Promise<ReadStream> {
    const fs = require("fs");
    const path = require("path");
    const filePath = path.join(this.filesPath, "ebooks", fileName);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException("File not found");
    }

    const fileStream = fs.createReadStream(filePath);
    return fileStream;
  }

  async deleteEbookFile(fileName: string): Promise<void> {
    const fs = require("fs");
    const path = require("path");
    const filePath = path.join(this.filesPath, "ebooks", fileName);

    if (!fs.existsSync(filePath)) {
      this.logger.warn(`File ${fileName} not found for deletion`);
      return;
    }

    fs.unlinkSync(filePath);
  }
}
