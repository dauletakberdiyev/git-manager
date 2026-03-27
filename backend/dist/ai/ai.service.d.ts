import { ConfigService } from '@nestjs/config';
export declare class AiService {
    private config;
    private openai;
    constructor(config: ConfigService);
    breakdown(taskTitle: string): Promise<string[]>;
}
