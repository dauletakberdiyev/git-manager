import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findOrCreate(githubId: string, username: string, accessToken: string): Promise<{
        id: string;
        githubId: string;
        username: string;
        accessToken: string;
        createdAt: Date;
    }>;
    findById(id: string): Promise<{
        id: string;
        githubId: string;
        username: string;
        accessToken: string;
        createdAt: Date;
    } | null>;
}
