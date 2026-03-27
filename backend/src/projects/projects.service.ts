import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GithubService } from '../github/github.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private github: GithubService,
  ) {}

  async findAll(userId: string) {
    return this.prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAvailableRepos(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const allRepos = await this.github.getUserRepos(user.accessToken);

    const imported = await this.prisma.project.findMany({
      where: { userId },
      select: { repoId: true },
    });
    const importedIds = new Set(imported.map((p) => p.repoId));

    return allRepos.filter((r) => !importedIds.has(r.repoId));
  }

  async create(userId: string, dto: CreateProjectDto) {
    const existing = await this.prisma.project.findUnique({
      where: { userId_repoId: { userId, repoId: dto.repoId } },
    });
    if (existing) throw new ConflictException('Repository already imported');

    return this.prisma.project.create({
      data: {
        userId,
        repoId: dto.repoId,
        name: dto.name,
        fullName: dto.fullName,
        defaultBranch: dto.defaultBranch,
      },
    });
  }

  async getTasks(userId: string, projectId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, userId },
    });
    if (!project) throw new NotFoundException('Project not found');

    return this.prisma.task.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
