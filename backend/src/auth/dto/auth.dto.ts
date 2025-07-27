import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'username for login', example: 'johnDoe' })
  username: string;

  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({
    description: 'password for Blologing',
    example: 'verySecretpassword',
  })
  password: string;
}
