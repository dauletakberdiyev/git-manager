import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GithubService } from '../github/github.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { CreateBulkTasksDto } from './dto/create-bulk-tasks.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import slugify from 'slugify';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private github: GithubService,
  ) {}

  async create(userId: string, dto: CreateTaskDto) {
    const project = await this.prisma.project.findFirst({
      where: { id: dto.projectId, userId },
      include: { user: true },
    });
    if (!project) throw new NotFoundException('Project not found');

    const slug = slugify(dto.title, { lower: true, strict: true });
    const branchName = `feature/${slug}`;

    const [owner, repo] = project.fullName.split('/');
    const sha = await this.github.getDefaultBranchSha(
      project.user.accessToken,
      owner,
      repo,
      project.defaultBranch,
    );

    await this.github.createBranch(
      project.user.accessToken,
      owner,
      repo,
      branchName,
      sha,
    );

    return this.prisma.task.create({
      data: {
        projectId: dto.projectId,
        title: dto.title,
        branchName,
      },
    });
  }

  async createBulk(userId: string, dto: CreateBulkTasksDto) {
    const project = await this.prisma.project.findFirst({
      where: { id: dto.projectId, userId },
      include: { user: true },
    });
    if (!project) throw new NotFoundException('Project not found');

    const [owner, repo] = project.fullName.split('/');
    const sha = await this.github.getDefaultBranchSha(
      project.user.accessToken,
      owner,
      repo,
      project.defaultBranch,
    );

    const branchNames = dto.titles.map(
      (title) => `feature/${slugify(title, { lower: true, strict: true })}`,
    );

    await Promise.all(
      branchNames.map((branchName) =>
        this.github.createBranch(
          project.user.accessToken,
          owner,
          repo,
          branchName,
          sha,
        ),
      ),
    );

    return this.prisma.$transaction(
      dto.titles.map((title, i) =>
        this.prisma.task.create({
          data: { projectId: dto.projectId, title, branchName: branchNames[i] },
        }),
      ),
    );
  }

  async update(userId: string, taskId: string, dto: UpdateTaskDto) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId },
      include: { project: true },
    });
    if (!task || task.project.userId !== userId) {
      throw new NotFoundException('Task not found');
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data: dto,
    });
  }
}
