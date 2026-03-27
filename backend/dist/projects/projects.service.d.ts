import { PrismaService } from '../prisma/prisma.service';
import { GithubService } from '../github/github.service';
import { CreateProjectDto } from './dto/create-project.dto';
export declare class ProjectsService {
    private prisma;
    private github;
    constructor(prisma: PrismaService, github: GithubService);
    findAll(userId: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        repoId: string;
        fullName: string;
        defaultBranch: string;
        userId: string;
    }[]>;
    getAvailableRepos(userId: string): Promise<{
        repoId: string;
        name: string;
        fullName: string;
        defaultBranch: string;
    }[]>;
    create(userId: string, dto: CreateProjectDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        repoId: string;
        fullName: string;
        defaultBranch: string;
        userId: string;
    }>;
    getTasks(userId: string, projectId: string): Promise<{
        id: string;
        createdAt: Date;
        projectId: string;
        title: string;
        status: import("@prisma/client").$Enums.TaskStatus;
        branchName: string | null;
    }[]>;
}
