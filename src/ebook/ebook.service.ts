import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { FileService } from "src/file/file.service";

@Injectable()
export class EbookService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService
  ) {}

  async getEbooks() {
    return this.prisma.ebook.findMany();
  }

  async createEbook(ebook: Prisma.EbookCreateInput, file: Express.Multer.File) {
    const { url } = await this.fileService.uploadFile(file);

    return this.prisma.ebook.create({
      data: {
        ...ebook,
        pdfUrl: url,
        pdfUrlCreatedAt: new Date(),
      },
    });
  }

  async updateEbook(id: string, ebook: Prisma.EbookUpdateInput) {
    return this.prisma.ebook.update({
      where: { id },
      data: ebook,
    });
  }

  async getUserEbooks(userId: string) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const ebooks = await this.prisma.ebook.findMany({
      where: {
        product: {
          orders: {
            some: {
              userId,
            },
          },
        },
      },
    });

    const processedEbooks = await Promise.all(
      ebooks.map(async (ebook) => {
        // Se não tem pdfUrlCreatedAt ou se passou de 7 dias, gera nova URL
        if (!ebook.pdfUrlCreatedAt || ebook.pdfUrlCreatedAt < sevenDaysAgo) {
          try {
            const newUrl = await this.fileService.generateNewUrl(ebook.id);

            // Atualiza o ebook no banco com a nova URL e timestamp
            const updatedEbook = await this.prisma.ebook.update({
              where: { id: ebook.id },
              data: {
                pdfUrl: newUrl,
                pdfUrlCreatedAt: new Date(),
              },
            });

            return updatedEbook;
          } catch (error) {
            // Se der erro ao gerar URL, retorna o ebook original
            console.error(`Erro ao gerar URL para ebook ${ebook.id}:`, error);
            return ebook;
          }
        }

        // Se a URL ainda é válida, retorna o ebook sem modificações
        return ebook;
      })
    );

    return processedEbooks;
  }
}
