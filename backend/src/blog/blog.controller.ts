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
import {
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

@ApiTags('Blogs')
@Controller('api/blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Blog berhasil dibuat.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 201 },
        message: { type: 'string', example: 'Blog successfully created' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            title: { type: 'string', example: 'Judul Blog Saya' },
            content: {
              type: 'string',
              example: 'Ini adalah konten menarik dari blog saya.',
            },
            slug: { type: 'string', example: 'judul-blog-saya' },
            authorId: { type: 'string', example: 'uuid-author-123' },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T12:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T12:30:00.000Z',
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description:
      'Pengguna tidak ditemukan dalam permintaan atau token tidak valid.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2023-01-01T12:00:00.000Z',
        },
        path: { type: 'string', example: '/api/blog' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Kesalahan validasi input atau permintaan yang buruk.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Bad Request' },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2023-01-01T12:00:00.000Z',
        },
        path: { type: 'string', example: '/api/blog' },
      },
    },
  })
  create(@Body() createBlogDto: CreateBlogDto, @Req() req: Request) {
    const user = req.user as { userId: string; username: string } | undefined;
    if (!user) {
      throw new UnauthorizedException('User not found in request.');
    }
    const userId = user.userId;
    return this.blogService.create(createBlogDto, userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Blog berhasil diperbarui.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: {
          type: 'string',
          example: 'Blog with ID 1 updated successfully',
        },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            title: { type: 'string', example: 'Judul Blog yang Diperbarui' },
            content: { type: 'string', example: 'Konten yang diperbarui.' },
            slug: { type: 'string', example: 'judul-blog-yang-diperbarui' },
            authorId: { type: 'string', example: 'uuid-author-123' },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T12:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T12:45:00.000Z',
            },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Blog dengan ID yang diberikan tidak ditemukan.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Blog with ID 1 not found' },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2023-01-01T12:00:00.000Z',
        },
        path: { type: 'string', example: '/api/blog/1' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token tidak valid atau tidak ada.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2023-01-01T12:00:00.000Z',
        },
        path: { type: 'string', example: '/api/blog/1' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Kesalahan validasi input atau permintaan yang buruk.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Bad Request' },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2023-01-01T12:00:00.000Z',
        },
        path: { type: 'string', example: '/api/blog/1' },
      },
    },
  })
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(+id, updateBlogDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Blog berhasil dihapus.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: {
          type: 'string',
          example: 'Blog with ID 1 has been successfully deleted',
        },
        data: { type: 'object', example: {} }, // Data kosong
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Blog dengan ID yang diberikan tidak ditemukan.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Blog with ID 1 not found' },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2023-01-01T12:00:00.000Z',
        },
        path: { type: 'string', example: '/api/blog/1' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token tidak valid atau tidak ada.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2023-01-01T12:00:00.000Z',
        },
        path: { type: 'string', example: '/api/blog/1' },
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.blogService.remove(+id);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Daftar semua blog berhasil diambil.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Daftar blog berhasil diambil' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              title: { type: 'string', example: 'Judul Blog Pertama' },
              content: { type: 'string', example: 'Konten blog pertama.' },
              slug: { type: 'string', example: 'judul-blog-pertama' },
              authorId: { type: 'string', example: 'uuid-author-123' },
              createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2023-01-01T12:00:00.000Z',
              },
              updatedAt: {
                type: 'string',
                format: 'date-time',
                example: '2023-01-01T12:00:00.000Z',
              },
            },
          },
        },
      },
    },
  })
  findAll() {
    return this.blogService.findAll();
  }

  @Get(':slug')
  @ApiResponse({
    status: 200,
    description: 'Blog berhasil ditemukan.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Blog berhasil ditemukan' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            title: { type: 'string', example: 'Judul Blog yang Ditemukan' },
            content: { type: 'string', example: 'Konten blog yang ditemukan.' },
            slug: { type: 'string', example: 'judul-blog-yang-ditemukan' },
            authorId: { type: 'string', example: 'uuid-author-123' },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T12:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T12:00:00.000Z',
            },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Blog dengan slug yang diberikan tidak ditemukan.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: {
          type: 'string',
          example: 'Blog with slug some-slug not found',
        },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2023-01-01T12:00:00.000Z',
        },
        path: { type: 'string', example: '/api/blog/some-slug' },
      },
    },
  })
  findOne(@Param('slug') slug: string) {
    return this.blogService.findOne(slug);
  }
}
