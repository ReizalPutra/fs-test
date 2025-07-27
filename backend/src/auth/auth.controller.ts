import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiResponse({
    status: 200,
    description:
      'Login berhasil, mengembalikan token akses dan detail pengguna.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'success' }, // Interceptor akan menambahkan 'success'
        data: {
          type: 'object',
          properties: {
            user_id: { type: 'string', example: 'uuid-user-123' },
            user_name: { type: 'string', example: 'john_doe' },
            access_token: {
              type: 'string',
              example:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1dWlkLXVzZXItMTIzIiwidXNlcm5hbWUiOiJqb2huX2RvZSIsImlhdCI6MTY3ODkwNTYwMCwiZXhwIjoxNjc4OTA2NTAwfQ.signature_here',
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Kredensial tidak valid (username atau password salah).',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' }, // Bisa 'User not found' atau 'Wrong password' dari service
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2023-01-01T12:00:00.000Z',
        },
        path: { type: 'string', example: '/api/auth/login' },
      },
    },
  })
  @ApiBadRequestResponse({
    description:
      'Kesalahan validasi input (misalnya, username atau password kosong).',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Bad Request' }, // Atau pesan validasi dari class-validator
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2023-01-01T12:00:00.000Z',
        },
        path: { type: 'string', example: '/api/auth/login' },
      },
    },
  })
  login(@Body() authDto: AuthDto) {
    return this.authService.login(authDto);
  }
}
