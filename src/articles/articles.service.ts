import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) { }

  async create(createArticleDto: CreateArticleDto) {
    const { tags, ...others } = createArticleDto

    const newTags = await this.prisma.$transaction(tags.map((tag) => this.prisma.tag.create({ data: tag })))
    return this.prisma.$transaction(async (tx) => {
      const article = await tx.article.create({
        data: {
          ...others,
          tags: {
            createMany: {
              data: newTags.map((tag) => ({ tagId: tag.id }))
            }
          }
        }
      })
    })
  }

  async findDrafts() {
    return this.prisma.article.findMany({
      where: { published: false },
      include: {
        tags: true,
      },
    });
  }

  async findAll() {
    return this.prisma.article.findMany({
      where: { published: true },
      include: {
        tags: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.article.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true
          }
        },
      }
    });
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    // return this.prisma.article.update({
    //   where: { id },
    //   data: updateArticleDto,
    // });
  }

  async remove(id: number) {
    return this.prisma.article.delete({ where: { id } })
  }
}
