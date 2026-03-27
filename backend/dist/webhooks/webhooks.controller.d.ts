import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { WebhooksService } from './webhooks.service';
export declare class WebhooksController {
    private webhooksService;
    private config;
    constructor(webhooksService: WebhooksService, config: ConfigService);
    handleGithubWebhook(event: string, signature: string, req: Request & {
        rawBody?: Buffer;
    }, payload: any): Promise<{
        received: boolean;
    }>;
}
