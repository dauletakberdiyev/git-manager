import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOrCreate(githubId: string, username: string, accessToken: string) {
    return this.prisma.user.upsert({
      where: { githubId },
      update: { accessToken, username },
      create: { githubId, username, accessToken },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
