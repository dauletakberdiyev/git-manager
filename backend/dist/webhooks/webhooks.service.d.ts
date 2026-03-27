import { PrismaService } from '../prisma/prisma.service';
export declare class WebhooksService {
    private prisma;
    constructor(prisma: PrismaService);
    handlePullRequest(payload: any): Promise<void>;
}
