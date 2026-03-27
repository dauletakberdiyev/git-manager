"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const github_service_1 = require("../github/github.service");
let ProjectsService = class ProjectsService {
    prisma;
    github;
    constructor(prisma, github) {
        this.prisma = prisma;
        this.github = github;
    }
    async findAll(userId) {
        return this.prisma.project.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getAvailableRepos(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const allRepos = await this.github.getUserRepos(user.accessToken);
        const imported = await this.prisma.project.findMany({
            where: { userId },
            select: { repoId: true },
        });
        const importedIds = new Set(imported.map((p) => p.repoId));
        return allRepos.filter((r) => !importedIds.has(r.repoId));
    }
    async create(userId, dto) {
        const existing = await this.prisma.project.findUnique({
            where: { userId_repoId: { userId, repoId: dto.repoId } },
        });
        if (existing)
            throw new common_1.ConflictException('Repository already imported');
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
    async getTasks(userId, projectId) {
        const project = await this.prisma.project.findFirst({
            where: { id: projectId, userId },
        });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        return this.prisma.task.findMany({
            where: { projectId },
            orderBy: { createdAt: 'asc' },
        });
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        github_service_1.GithubService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map