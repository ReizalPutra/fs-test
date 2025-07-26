import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { generateUniqueSlug } from 'src/common/utils/generateSlug';
import { PrismaService } from 'src/common/prisma.service';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}
  // async create(createBlogDto: CreateBlogDto) {
  //   const slug = await generateUniqueSlug(
  //     createBlogDto.title,
  //     async (slug: string) => {
  //       const existing = await this.prisma.blog.findUnique({ where: { slug } });
  //       return !!existing;
  //     },
  //   );

  //   const data = await this.prisma.blog.create({
  //     data: {
  //       title: createBlogDto.title,
  //       content: createBlogDto.content,
  //       slug,
  //     },
  //   });
  //   return {
  //     message: `Blog successfully created`,
  //     data: data,
  //   };
  // }

  async findAll() {
    return await this.prisma.blog.findMany();
  }

  async findOne(id: number) {
    const blog = await this.prisma.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }

    return blog;
  }

  async update(id: number, updateBlogDto: UpdateBlogDto) {
    try {
      const updated = await this.prisma.blog.update({
        where: { id },
        data: updateBlogDto,
      });

      return {
        message: `Blog with ID ${id} updated successfully`,
        data: updated,
      };
    } catch (error) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.blog.delete({
        where: { id },
      });

      return {
        message: `Blog with ID ${id} has been successfully deleted`,
      };
    } catch (error) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }
  }
}
