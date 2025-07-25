import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Optional: supaya PrismaService tersedia di seluruh aplikasi tanpa perlu import module lagi
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class CommonModule {}
