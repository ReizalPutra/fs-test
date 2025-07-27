import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/common/prisma.service';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async validateUser(username: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) throw new UnauthorizedException('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Wrong password');

    return user;
  }

  async login(authDto: AuthDto) {
    const user = await this.validateUser(authDto.username, authDto.password);
    return this.signToken(user.id, user.username);
  }
  async signToken(
    userId: string,
    username: string,
  ): Promise<{ user_id: string; user_name: string; access_token: string }> {
    const payload = {
      sub: userId,
      username,
    };

    const secret: string = this.config.get('JWT_SECRET') || 'secret';
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });

    return {
      user_id: userId,
      user_name: username,
      access_token: token,
    };
  }
}
