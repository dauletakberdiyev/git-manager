import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
export declare class ProjectsController {
    private projectsService;
    constructor(projectsService: ProjectsService);
    findAll(req: any): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        repoId: string;
        fullName: string;
        defaultBranch: string;
        userId: string;
    }[]>;
    getAvailableRepos(req: any): Promise<{
        repoId: string;
        name: string;
        fullName: string;
        defaultBranch: string;
    }[]>;
    create(req: any, dto: CreateProjectDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        repoId: string;
        fullName: string;
        defaultBranch: string;
        userId: string;
    }>;
    getTasks(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        projectId: string;
        title: string;
        status: import("@prisma/client").$Enums.TaskStatus;
        branchName: string | null;
    }[]>;
}
