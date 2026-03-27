import { PrismaService } from '../prisma/prisma.service';
import { GithubService } from '../github/github.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { CreateBulkTasksDto } from './dto/create-bulk-tasks.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksService {
    private prisma;
    private github;
    constructor(prisma: PrismaService, github: GithubService);
    create(userId: string, dto: CreateTaskDto): Promise<{
        id: string;
        createdAt: Date;
        projectId: string;
        title: string;
        status: import("@prisma/client").$Enums.TaskStatus;
        branchName: string | null;
    }>;
    createBulk(userId: string, dto: CreateBulkTasksDto): Promise<{
        id: string;
        createdAt: Date;
        projectId: string;
        title: string;
        status: import("@prisma/client").$Enums.TaskStatus;
        branchName: string | null;
    }[]>;
    update(userId: string, taskId: string, dto: UpdateTaskDto): Promise<{
        id: string;
        createdAt: Date;
        projectId: string;
        title: string;
        status: import("@prisma/client").$Enums.TaskStatus;
        branchName: string | null;
    }>;
}
