import {
  Controller,
  Post,
  Headers,
  Body,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Request } from 'express';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(
    private webhooksService: WebhooksService,
    private config: ConfigService,
  ) {}

  @Post('github')
  async handleGithubWebhook(
    @Headers('x-github-event') event: string,
    @Headers('x-hub-signature-256') signature: string,
    @Req() req: Request & { rawBody?: Buffer },
    @Body() payload: any,
  ) {
    const secret = this.config.get<string>('GITHUB_WEBHOOK_SECRET');
    if (secret && req.rawBody) {
      const hmac = crypto
        .createHmac('sha256', secret)
        .update(req.rawBody)
        .digest('hex');
      if (`sha256=${hmac}` !== signature) {
        throw new UnauthorizedException('Invalid webhook signature');
      }
    }

    if (event === 'pull_request') {
      await this.webhooksService.handlePullRequest(payload);
    }

    return { received: true };
  }
}
