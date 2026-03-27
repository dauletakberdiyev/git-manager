import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { CreateBulkTasksDto } from './dto/create-bulk-tasks.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksController {
    private tasksService;
    constructor(tasksService: TasksService);
    createBulk(req: any, dto: CreateBulkTasksDto): Promise<{
        id: string;
        createdAt: Date;
        projectId: string;
        title: string;
        status: import("@prisma/client").$Enums.TaskStatus;
        branchName: string | null;
    }[]>;
    create(req: any, dto: CreateTaskDto): Promise<{
        id: string;
        createdAt: Date;
        projectId: string;
        title: string;
        status: import("@prisma/client").$Enums.TaskStatus;
        branchName: string | null;
    }>;
    update(req: any, id: string, dto: UpdateTaskDto): Promise<{
        id: string;
        createdAt: Date;
        projectId: string;
        title: string;
        status: import("@prisma/client").$Enums.TaskStatus;
        branchName: string | null;
    }>;
}
