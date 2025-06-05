import { Injectable, NotFoundException } from "@nestjs/common";
import * as Minio from "minio";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class FileService {
  private client: Minio.Client;

  constructor(private readonly prismaService: PrismaService) {
    this.client = new Minio.Client({
      endPoint: "members-area-minio-c03ed7-64-227-108-129.traefik.me",
      port: 9000,
      useSSL: false,
      accessKey: "9Dt6zU3zkt7kMU7NSjhj",
      secretKey: "mDKBuGfTs8kXJ02ZXTh1wPmBpQ4Q0r350PRh8dtT",
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
      "members-area-pdf",
      ebook.title,
      7 * 24 * 60 * 60
    );

    return url;
  }

  async uploadFile(file: Express.Multer.File) {
    await this.client.putObject(
      "members-area-pdf",
      file.originalname,
      file.buffer
    );

    const url = await this.client.presignedUrl(
      "GET",
      "members-area-pdf",
      file.originalname,
      7 * 24 * 60 * 60
    );

    return {
      url,
    };
  }
}
