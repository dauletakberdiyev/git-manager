import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WebhooksService {
  constructor(private prisma: PrismaService) {}

  async handlePullRequest(payload: any): Promise<void> {
    const { action, pull_request } = payload;

    if (action === 'closed' && pull_request?.merged === true) {
      const branchName = pull_request.head.ref as string;
      await this.prisma.task.updateMany({
        where: { branchName },
        data: { status: 'DONE' },
      });
    }
  }
}
