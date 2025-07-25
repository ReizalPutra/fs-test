import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { generateUniqueSlug } from 'src/common/utils/generateSlug';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}
  async create(createBlogDto: CreateBlogDto) {
    const slug = await generateUniqueSlug(
      createBlogDto.title,
      async (slug: string) => {
        const existing = await this.prisma.blog.findUnique({ where: { slug } });
        return !!existing;
      },
    );

    return this.prisma.blog.create({
      data: {
        title: createBlogDto.title,
        content: createBlogDto.content,
        slug,
      },
    });
  }

  findAll() {
    return `This action returns all blog`;
  }

  findOne(id: number) {
    return `This action returns a #${id} blog`;
  }

  update(id: number, updateBlogDto: UpdateBlogDto) {
    return `This action updates a #${id} blog`;
  }

  remove(id: number) {
    return `This action removes a #${id} blog`;
  }
}
