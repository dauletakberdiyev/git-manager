import { AiService } from './ai.service';
import { BreakdownDto } from './dto/breakdown.dto';
export declare class AiController {
    private aiService;
    constructor(aiService: AiService);
    breakdown(dto: BreakdownDto): Promise<string[]>;
}
