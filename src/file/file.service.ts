import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as Minio from "minio";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class FileService {
  private client: Minio.Client;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService
  ) {
    this.client = new Minio.Client({
      endPoint: this.configService.get("MINIO_ENDPOINT")!,
      port: this.configService.get("MINIO_PORT")!,
      useSSL: false,
      accessKey: this.configService.get("MINIO_ACCESS_KEY")!,
      secretKey: this.configService.get("MINIO_SECRET_KEY")!,
    });
  }

  async generateNewUrl(ebookId: string) {
    const ebook = await this.prismaService.ebook.findUnique({
      where: {
        id: ebookId,
      },
    });

    if (!ebook) {
      throw new NotFoundException("Ebook not found");
    }

    const url = await this.client.presignedUrl(
      "GET",
      this.configService.get("MINIO_BUCKET_NAME")!,
      ebook.title,
      7 * 24 * 60 * 60
    );

    return url;
  }

  async uploadFile(file: Express.Multer.File) {
    await this.client.putObject(
      this.configService.get("MINIO_BUCKET_NAME")!,
      file.originalname,
      file.buffer
    );

    const url = await this.client.presignedUrl(
      "GET",
      this.configService.get("MINIO_BUCKET_NAME")!,
      file.originalname,
      7 * 24 * 60 * 60
    );

    return {
      url,
    };
  }
}
