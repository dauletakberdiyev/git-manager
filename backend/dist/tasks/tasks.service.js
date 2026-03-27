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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const github_service_1 = require("../github/github.service");
const slugify_1 = __importDefault(require("slugify"));
let TasksService = class TasksService {
    prisma;
    github;
    constructor(prisma, github) {
        this.prisma = prisma;
        this.github = github;
    }
    async create(userId, dto) {
        const project = await this.prisma.project.findFirst({
            where: { id: dto.projectId, userId },
            include: { user: true },
        });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        const slug = (0, slugify_1.default)(dto.title, { lower: true, strict: true });
        const branchName = `feature/${slug}`;
        const [owner, repo] = project.fullName.split('/');
        const sha = await this.github.getDefaultBranchSha(project.user.accessToken, owner, repo, project.defaultBranch);
        await this.github.createBranch(project.user.accessToken, owner, repo, branchName, sha);
        return this.prisma.task.create({
            data: {
                projectId: dto.projectId,
                title: dto.title,
                branchName,
            },
        });
    }
    async createBulk(userId, dto) {
        const project = await this.prisma.project.findFirst({
            where: { id: dto.projectId, userId },
            include: { user: true },
        });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        const [owner, repo] = project.fullName.split('/');
        const sha = await this.github.getDefaultBranchSha(project.user.accessToken, owner, repo, project.defaultBranch);
        const branchNames = dto.titles.map((title) => `feature/${(0, slugify_1.default)(title, { lower: true, strict: true })}`);
        await Promise.all(branchNames.map((branchName) => this.github.createBranch(project.user.accessToken, owner, repo, branchName, sha)));
        return this.prisma.$transaction(dto.titles.map((title, i) => this.prisma.task.create({
            data: { projectId: dto.projectId, title, branchName: branchNames[i] },
        })));
    }
    async update(userId, taskId, dto) {
        const task = await this.prisma.task.findFirst({
            where: { id: taskId },
            include: { project: true },
        });
        if (!task || task.project.userId !== userId) {
            throw new common_1.NotFoundException('Task not found');
        }
        return this.prisma.task.update({
            where: { id: taskId },
            data: dto,
        });
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        github_service_1.GithubService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map