import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { JwtGuard } from 'src/auth/guard';
import { Request } from 'express';

@Controller('api/blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}
  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createBlogDto: CreateBlogDto, @Req() req: Request) {
    const user = req.user as { userId: string; username: string } | undefined;
    if (!user) {
      throw new UnauthorizedException('User not found in request.');
    }
    const userId = user.userId;
    return this.blogService.create(createBlogDto, userId);
  }
  @UseGuards(JwtGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(+id, updateBlogDto);
  }
  @UseGuards(JwtGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.blogService.remove(+id);
  }

  @Get()
  findAll() {
    return this.blogService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.blogService.findOne(slug);
  }
}
