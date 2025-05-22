import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { randomUUID } from "crypto";

@Injectable()
export class FileService {
  private client: S3Client;

  constructor(private configService: ConfigService) {
    const accountId = configService.get("CLOUDFARE_ACCOUNT_ID");

    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: "auto",
      credentials: {
        accessKeyId: configService.get("AWS_ACCESS_KEY_ID")!,
        secretAccessKey: configService.get("AWS_SECRET_ACCESS_KEY")!,
      },
    });
  }

  async uploadFile(file: Express.Multer.File) {
    const uploadId = randomUUID();

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.configService.get("AWS_BUKET_NAME")!,
        Key: `${uploadId}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );

    return {
      url: `${this.configService.get("CLOUDFARE_URL")}/${uploadId}-${
        file.originalname
      }`,
    };
  }
}
