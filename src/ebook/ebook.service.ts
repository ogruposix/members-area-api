import { Injectable, Logger } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { FileService } from "src/file/file.service";

@Injectable()
export class EbookService {
  private readonly logger = new Logger(EbookService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService
  ) {}

  async getEbooks() {
    return this.prisma.ebook.findMany({
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async createEbook(
    ebook: Prisma.EbookCreateInput,
    productIds: string,
    file: Express.Multer.File
  ) {
    const { url, fileName } = await this.fileService.uploadEbookFile(file);

    return this.prisma.ebook.create({
      data: {
        ...ebook,
        fileName,
        pdfUrl: url,
        pdfUrlCreatedAt: new Date(),
        products: {
          create: productIds.split(",").map((id) => {
            return {
              product: {
                connect: {
                  id,
                },
              },
            };
          }),
        },
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async updateEbook(id: string, ebook: Prisma.EbookUpdateInput) {
    return this.prisma.ebook.update({
      where: { id },
      data: ebook,
    });
  }

  async deleteEbook(id: string) {
    const ebook = await this.prisma.ebook.findUnique({
      where: { id },
    });

    if (!ebook) {
      throw new Error("Ebook not found");
    }

    if (ebook.fileName) {
      await this.fileService.deleteEbookFile(ebook.fileName);
    }

    await this.prisma.productEbook.deleteMany({
      where: { ebookId: id },
    });

    return this.prisma.ebook.delete({
      where: { id },
    });
  }

  async getUserEbooks(userId: string) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const ebooks = await this.prisma.ebook.findMany({
      where: {
        products: {
          some: {
            product: {
              orders: {
                some: {
                  userId,
                },
              },
            },
          },
        },
      },
    });

    return ebooks;
  }
}
